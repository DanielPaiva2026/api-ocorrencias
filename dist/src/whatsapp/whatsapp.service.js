"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const https = __importStar(require("https"));
const prisma_service_1 = require("../prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const openai_1 = __importDefault(require("openai"));
let WhatsappService = WhatsappService_1 = class WhatsappService {
    prisma;
    logger = new common_1.Logger(WhatsappService_1.name);
    token = process.env.WHATSAPP_TOKEN;
    phoneId = process.env.WHATSAPP_PHONE_ID;
    apiUrl = `https://graph.facebook.com/v19.0/${this.phoneId}/messages`;
    openai;
    constructor(prisma) {
        this.prisma = prisma;
        if (process.env.OPENAI_API_KEY) {
            this.openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
        }
    }
    async sendMessage(to, message) {
        if (!this.token || !this.phoneId) {
            this.logger.warn('WhatsApp API não configurada (Tokens ausentes). Simulando envio:');
            this.logger.log(`Para: ${to} | Mensagem: ${message}`);
            return false;
        }
        const formattedTo = to.replace(/\D/g, '');
        try {
            await axios_1.default.post(this.apiUrl, {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: formattedTo,
                type: 'text',
                text: {
                    preview_url: false,
                    body: message
                }
            }, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            });
            this.logger.log(`WhatsApp enviado com sucesso para ${formattedTo}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Exceção ao enviar WhatsApp: ${error.message}`);
            return false;
        }
    }
    async sendTemplateMessage(to, templateName, parameters) {
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
            await axios_1.default.post(this.apiUrl, {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: formattedTo,
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: 'pt_BR' },
                    components: parameters.length > 0 ? components : []
                }
            }, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            });
            this.logger.log(`Template ${templateName} enviado com sucesso para ${formattedTo}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Exceção ao enviar Template WhatsApp: ${error.message}`);
            return false;
        }
    }
    async notifyGestores(postoId, message, templateName, templateParams) {
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
            }
            else {
                await this.sendMessage(to, message);
            }
        }
    }
    async downloadMedia(mediaId, mimeType, extension) {
        try {
            const res = await axios_1.default.get(`https://graph.facebook.com/v19.0/${mediaId}`, {
                headers: { Authorization: `Bearer ${this.token}` },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            });
            const mediaUrl = res.data.url;
            if (!mediaUrl)
                return null;
            const fileRes = await axios_1.default.get(mediaUrl, {
                headers: { Authorization: `Bearer ${this.token}` },
                responseType: 'arraybuffer',
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            });
            const fileName = `${crypto.randomUUID()}.${extension}`;
            const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
            fs.writeFileSync(filePath, fileRes.data);
            this.logger.log(`Mídia baixada com sucesso: ${filePath}`);
            return filePath;
        }
        catch (e) {
            this.logger.error(`Erro ao baixar mídia: ${e.message}`);
            return null;
        }
    }
    async transcribeAudio(filePath) {
        if (!this.openai) {
            this.logger.warn('OpenAI API Key não configurada. Transcrição ignorada.');
            return null;
        }
        try {
            this.logger.log(`Enviando áudio para transcrição (Whisper): ${filePath}`);
            const transcription = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(filePath),
                model: 'whisper-1',
                language: 'pt',
            });
            this.logger.log(`Transcrição concluída: "${transcription.text}"`);
            return transcription.text;
        }
        catch (e) {
            this.logger.error(`Erro na transcrição de áudio: ${e.message}`);
            return null;
        }
    }
    async processWebhookMessage(payload) {
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
                if (message.type === 'audio') {
                    const mediaId = message.audio.id;
                    const mimeType = message.audio.mime_type;
                    mediaPath = await this.downloadMedia(mediaId, mimeType, 'ogg');
                    if (mediaPath) {
                        const transcript = await this.transcribeAudio(mediaPath);
                        if (transcript) {
                            incomingText = transcript;
                            await this.sendMessage(from, `🎙️ *Áudio recebido e transcrito:* "${transcript}"`);
                        }
                        else {
                            await this.sendMessage(from, "Desculpe, recebi seu áudio mas não consegui transcrevê-lo.");
                            return;
                        }
                    }
                }
                else if (message.type === 'image') {
                    const mediaId = message.image.id;
                    const mimeType = message.image.mime_type;
                    mediaPath = await this.downloadMedia(mediaId, mimeType, 'jpg');
                    isAtestado = true;
                    incomingText = message.image.caption || '[Imagem recebida]';
                }
                else if (message.type === 'document') {
                    const mediaId = message.document.id;
                    const mimeType = message.document.mime_type;
                    mediaPath = await this.downloadMedia(mediaId, mimeType, 'pdf');
                    isAtestado = true;
                    incomingText = message.document.caption || message.document.filename || '[Documento recebido]';
                }
                else if (message.type === 'text') {
                    incomingText = message.text?.body || '';
                }
                if (isAtestado && mediaPath) {
                    await this.sendMessage(from, `📁 Recebemos o seu documento. Arquivo salvo internamente para análise.`);
                }
                else if (message.type === 'text') {
                    await this.sendMessage(from, `Olá! Recebemos sua mensagem: "${incomingText}". Nossa assistente virtual logo entrará em operação.`);
                }
            }
        }
        catch (e) {
            this.logger.error('Erro ao processar mensagem do Webhook', e);
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map