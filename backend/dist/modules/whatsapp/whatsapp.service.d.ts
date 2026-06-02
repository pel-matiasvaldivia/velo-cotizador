import { ConfigService } from '@nestjs/config';
import { AiService } from '../ai/ai.service';
import { CotizacionService } from '../cotizacion/cotizacion.service';
import { Repository } from 'typeorm';
import { Lead } from '../leads/leads.entity';
export declare class WhatsappService {
    private configService;
    private aiService;
    private cotizacionService;
    private leadRepository;
    private readonly logger;
    private redis;
    constructor(configService: ConfigService, aiService: AiService, cotizacionService: CotizacionService, leadRepository: Repository<Lead>);
    handleMessage(from: string, body: string): Promise<any>;
    private formatTechnicalResponse;
}
