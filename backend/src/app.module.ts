import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AiModule } from './modules/ai/ai.module.ts';
import { CotizacionModule } from './modules/cotizacion/cotizacion.module.ts';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module.ts';
import { PdfModule } from './modules/pdf/pdf.module.ts';
import { EmailModule } from './modules/email/email.module.ts';
import { LeadsModule } from './modules/leads/leads.module.ts';
import databaseConfig from './config/database.config';
import aiConfig from './config/ai.config';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, aiConfig, redisConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('database'),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.get('redis.url'),
      }),
    }),
    AiModule,
    CotizacionModule,
    WhatsappModule,
    PdfModule,
    EmailModule,
    LeadsModule,
  ],
})
export class AppModule {}
