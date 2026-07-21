import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import OpenAI from 'openai';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly token = process.env.WHATSAPP_TOKEN;
  private readonly phoneId = process.env.WHATSAPP_PHONE_ID;
  private readonly apiUrl = `https://graph.facebook.com/v19.0/${this.phoneId}/messages`;
  private readonly openai: OpenAI;

  constructor(private prisma: PrismaService) {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  async sendMessage(to: string, message: string) {
    if (!this.token || !this.phoneId) {
      this.logger.warn('WhatsApp API não configurada (Tokens ausentes). Simulando envio:');
      this.logger.log(`Para: ${to} | Mensagem: ${message}`);
      return false;
    }

    const formattedTo = to.replace(/\D/g, '');

    try {
      await axios.post(
        this.apiUrl,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedTo,
          type: 'text',
          text: {
            preview_url: false,
            body: message
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        }
      );

      this.logger.log(`WhatsApp enviado com sucesso para ${formattedTo}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Exceção ao enviar WhatsApp: ${error.message}`);
      return false;
    }
  }

  async sendTemplateMessage(to: string, templateName: string, parameters: any[]) {
    if (!this.token || !this.phoneId) {
      this.logger.warn('WhatsApp API não configurada. Simulando envio de template:');
      this.logger.log(`Para: ${to} | Template: ${templateName}`);
      return false;
    }

    const formattedTo = to.replace(/\D/g, '');

    const components = [
      {
        type: 'body',
        parameters: parameters.map(p => ({ type: 'text', text: String(p) }))
      }
    ];

    try {
      await axios.post(
        this.apiUrl,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedTo,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'pt_BR' },
            components: parameters.length > 0 ? components : []
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        }
      );

      this.logger.log(`Template ${templateName} enviado com sucesso para ${formattedTo}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Exceção ao enviar Template WhatsApp: ${error.message}`);
      return false;
    }
  }

  async notifyGestores(postoId: string | null, message: string, templateName?: string, templateParams?: any[]) {
    let targets = [];
    
    const gestores = await this.prisma.usuario.findMany({
      where: {
        role: { in: ['SUPERVISOR', 'OPERACIONAL', 'TEC_SEGURANCA'] },
        telefone_whatsapp: { not: null }
      }
    });

    for (const gestor of gestores) {
      if (gestor.telefone_whatsapp) {
        targets.push(gestor.telefone_whatsapp);
      }
    }
    
    if (targets.length === 0) {
      targets.push('5524981151562');
    }

    targets = [...new Set(targets)];

    for (const to of targets) {
      if (templateName) {
        await this.sendTemplateMessage(to, templateName, templateParams || []);
      } else {
        await this.sendMessage(to, message);
      }
    }
  }

  async downloadMedia(mediaId: string, mimeType: string, extension: string): Promise<string | null> {
    try {
      // 1. Obter a URL de download
      const res = await axios.get(`https://graph.facebook.com/v19.0/${mediaId}`, {
        headers: { Authorization: `Bearer ${this.token}` },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      });

      const mediaUrl = res.data.url;
      if (!mediaUrl) return null;

      // 2. Baixar o arquivo binário
      const fileRes = await axios.get(mediaUrl, {
        headers: { Authorization: `Bearer ${this.token}` },
        responseType: 'arraybuffer',
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      });

      // 3. Salvar no disco local
      const fileName = `${crypto.randomUUID()}.${extension}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      
      fs.writeFileSync(filePath, fileRes.data);
      this.logger.log(`Mídia baixada com sucesso: ${filePath}`);
      
      return filePath;
    } catch (e: any) {
      this.logger.error(`Erro ao baixar mídia: ${e.message}`);
      return null;
    }
  }

  async transcribeAudio(filePath: string): Promise<string | null> {
    if (!this.openai) {
      this.logger.warn('OpenAI API Key não configurada. Transcrição ignorada.');
      return null;
    }

    try {
      this.logger.log(`Enviando áudio para transcrição (Whisper): ${filePath}`);
      // No Node v18+, fs.createReadStream funciona nativamente com o SDK da OpenAI
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath) as any,
        model: 'whisper-1',
        language: 'pt',
      });

      this.logger.log(`Transcrição concluída: "${transcription.text}"`);
      return transcription.text;
    } catch (e: any) {
      this.logger.error(`Erro na transcrição de áudio: ${e.message}`);
      return null;
    }
  }

  async processWebhookMessage(payload: any) {
    this.logger.log(`Mensagem recebida no Webhook: ${JSON.stringify(payload)}`);
    
    try {
      const entry = payload.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message) {
        const from = message.from;
        let incomingText = '';
        let mediaPath = null;
        let isAtestado = false;

        // 1. Tratamento de Áudio
        if (message.type === 'audio') {
          const mediaId = message.audio.id;
          const mimeType = message.audio.mime_type;
          mediaPath = await this.downloadMedia(mediaId, mimeType, 'ogg');
          
          if (mediaPath) {
            const transcript = await this.transcribeAudio(mediaPath);
            if (transcript) {
              incomingText = transcript; // O áudio transcrito vira o "texto" da mensagem
              await this.sendMessage(from, `🎙️ *Áudio recebido e transcrito:* "${transcript}"`);
            } else {
              await this.sendMessage(from, "Desculpe, recebi seu áudio mas não consegui transcrevê-lo.");
              return;
            }
          }
        } 
        // 2. Tratamento de Imagem/Documento (Atestado)
        else if (message.type === 'image') {
          const mediaId = message.image.id;
          const mimeType = message.image.mime_type;
          mediaPath = await this.downloadMedia(mediaId, mimeType, 'jpg');
          isAtestado = true;
          incomingText = message.image.caption || '[Imagem recebida]';
        } else if (message.type === 'document') {
          const mediaId = message.document.id;
          const mimeType = message.document.mime_type;
          mediaPath = await this.downloadMedia(mediaId, mimeType, 'pdf');
          isAtestado = true;
          incomingText = message.document.caption || message.document.filename || '[Documento recebido]';
        }
        // 3. Texto normal
        else if (message.type === 'text') {
          incomingText = message.text?.body || '';
        }

        // Lógica temporária de resposta (antes do motor de IA)
        if (isAtestado && mediaPath) {
           await this.sendMessage(from, `📁 Recebemos o seu documento. Arquivo salvo internamente para análise.`);
        } else if (message.type === 'text') {
           await this.sendMessage(from, `Olá! Recebemos sua mensagem: "${incomingText}". Nossa assistente virtual logo entrará em operação.`);
        }
      }
    } catch (e) {
      this.logger.error('Erro ao processar mensagem do Webhook', e);
    }
  }
}
