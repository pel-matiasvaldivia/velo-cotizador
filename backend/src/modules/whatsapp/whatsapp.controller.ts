import { Controller, Post, Body, Get, Query, Logger } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('webhook')
  async webhook(@Body() body: any) {
    // Basic webhook extraction (adapting to standard formats)
    const from = body.From || body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
    const text = body.Body || body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;

    if (from && text) {
      const response = await this.whatsappService.handleMessage(from, text);
      // In a real Twilio integration, you'd return TwiML
      // In a Meta Cloud API, you'd call their sendMessage API
      return { status: 'processed', response };
    }

    return { status: 'ignored' };
  }

  @Get('webhook')
  verifyWebhook(@Query('hub.challenge') challenge: string) {
    // Meta Cloud API verification logic
    return challenge;
  }
}
