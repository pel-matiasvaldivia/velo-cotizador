import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService } from '../ai/ai.service';
import { CotizacionService } from '../cotizacion/cotizacion.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../leads/leads.entity';
import { Redis } from 'ioredis';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private redis: Redis;

  constructor(
    private configService: ConfigService,
    private aiService: AiService,
    private cotizacionService: CotizacionService,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {
    this.redis = new Redis(this.configService.get<string>('redis.url') || 'redis://localhost:6379');
  }

  async handleMessage(from: string, body: string) {
    try {
      this.logger.log(`Received message from ${from}: ${body}`);
      
      // 1. Get or create session context from Redis
      const sessionKey = `wa_session:${from}`;
      const historyStr = await this.redis.get(sessionKey);
      const history = historyStr ? JSON.parse(historyStr) : [];

      // 2. Process with AI
      const aiResponse = await this.aiService.generateProposal(body, history);

      // 3. Update history
      history.push({ role: 'user', content: body });
      if (aiResponse.tipo === 'solicitud_info') {
        history.push({ role: 'assistant', content: aiResponse.preguntas.join(' ') });
        await this.redis.set(sessionKey, JSON.stringify(history), 'EX', 86400); // 24h
        return aiResponse.preguntas.join('\n');
      }

      // If it's a quote, clear session and send summary
      await this.redis.del(sessionKey);
      
      // 4. Create record in DB if enough info
      if (aiResponse.tipo === 'cotizacion_preliminar') {
        // Logic to extract data and create cotizacion would go here
        // For now, return the AI technical summary
        return this.formatTechnicalResponse(aiResponse);
      }

      return aiResponse.resumen_para_comercial || 'Gracias por tu consulta. Un asesor técnico te contactará pronto.';
    } catch (error) {
      this.logger.error('Error handling WhatsApp message', error);
      return 'Lo siento, estamos experimentando dificultades técnicas. Por favor, intente más tarde.';
    }
  }

  private formatTechnicalResponse(response: any) {
    const min = response.propuesta.total_estimado_usd.min;
    const max = response.propuesta.total_estimado_usd.max;
    return `🏭 *PROPUESTA VELO ARGENTINA*\n\n` +
           `✅ *Proyecto:* ${response.proyecto.descripcion}\n` +
           `💰 *Inversión estimada:* USD ${min.toLocaleString()} - ${max.toLocaleString()}\n` +
           `⏱️ *Plazo fabricación:* ${response.propuesta.tiempo_total_semanas} semanas\n\n` +
           `Un asesor comercial te enviará el PDF detallado por este medio en breve.`;
  }
}
