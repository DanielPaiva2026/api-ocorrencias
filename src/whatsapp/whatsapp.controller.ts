import { Controller, Get, Post, Body, Query, Req, Res, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import type { Request, Response } from 'express';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  // Rota GET usada pela Meta para verificar e ativar o Webhook
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('WEBHOOK_VERIFIED');
        res.status(HttpStatus.OK).send(challenge);
      } else {
        res.sendStatus(HttpStatus.FORBIDDEN);
      }
    } else {
      res.sendStatus(HttpStatus.BAD_REQUEST);
    }
  }

  // Rota POST usada pela Meta para enviar as mensagens novas
  @Post('webhook')
  receiveMessage(@Body() body: any, @Res() res: Response) {
    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        // Envia para o service processar
        this.whatsappService.processWebhookMessage(body);
      }
      res.sendStatus(HttpStatus.OK);
    } else {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}
