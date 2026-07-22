import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AiModule } from './modules/ai/ai.module';
import { CotizacionModule } from './modules/cotizacion/cotizacion.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { EmailModule } from './modules/email/email.module';
import { LeadsModule } from './modules/leads/leads.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CatalogModule } from './modules/catalog/catalog.module';
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
      useFactory: (config: ConfigService) => config.get('database')!,
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.get<string>('redis.url'),
      }),
    }),
    AuthModule,
    UsersModule,
    CatalogModule,
    AiModule,
    CotizacionModule,
    WhatsappModule,
    PdfModule,
    EmailModule,
    LeadsModule,
  ],
})
export class AppModule {}
