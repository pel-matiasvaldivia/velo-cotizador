"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const ai_module_1 = require("./modules/ai/ai.module");
const cotizacion_module_1 = require("./modules/cotizacion/cotizacion.module");
const whatsapp_module_1 = require("./modules/whatsapp/whatsapp.module");
const pdf_module_1 = require("./modules/pdf/pdf.module");
const email_module_1 = require("./modules/email/email.module");
const leads_module_1 = require("./modules/leads/leads.module");
const database_config_1 = __importDefault(require("./config/database.config"));
const ai_config_1 = __importDefault(require("./config/ai.config"));
const redis_config_1 = __importDefault(require("./config/redis.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default, ai_config_1.default, redis_config_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => config.get('database'),
            }),
            bull_1.BullModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    redis: config.get('redis.url'),
                }),
            }),
            ai_module_1.AiModule,
            cotizacion_module_1.CotizacionModule,
            whatsapp_module_1.WhatsappModule,
            pdf_module_1.PdfModule,
            email_module_1.EmailModule,
            leads_module_1.LeadsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map