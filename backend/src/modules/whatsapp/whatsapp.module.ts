import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { Lead } from '../leads/leads.entity';
import { AiModule } from '../ai/ai.module';
import { CotizacionModule } from '../cotizacion/cotizacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead]),
    AiModule,
    CotizacionModule,
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {}
