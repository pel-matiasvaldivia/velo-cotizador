import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CotizacionController } from './cotizacion.controller';
import { CotizacionService } from './cotizacion.service';
import { Cotizacion, CotizacionItem } from './cotizacion.entity';
import { Lead } from '../leads/leads.entity';
import { AiModule } from '../ai/ai.module';
import { PdfModule } from '../pdf/pdf.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cotizacion, CotizacionItem, Lead]),
    AiModule,
    PdfModule,
    EmailModule,
  ],
  controllers: [CotizacionController],
  providers: [CotizacionService],
  exports: [CotizacionService],
})
export class CotizacionModule {}
