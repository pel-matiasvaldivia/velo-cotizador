"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ai_service_1 = require("../ai/ai.service");
const cotizacion_service_1 = require("../cotizacion/cotizacion.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leads_entity_1 = require("../leads/leads.entity");
const ioredis_1 = require("ioredis");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    configService;
    aiService;
    cotizacionService;
    leadRepository;
    logger = new common_1.Logger(WhatsappService_1.name);
    redis;
    constructor(configService, aiService, cotizacionService, leadRepository) {
        this.configService = configService;
        this.aiService = aiService;
        this.cotizacionService = cotizacionService;
        this.leadRepository = leadRepository;
        this.redis = new ioredis_1.Redis(this.configService.get('redis.url') || 'redis://localhost:6379');
    }
    async handleMessage(from, body) {
        try {
            this.logger.log(`Received message from ${from}: ${body}`);
            const sessionKey = `wa_session:${from}`;
            const historyStr = await this.redis.get(sessionKey);
            const history = historyStr ? JSON.parse(historyStr) : [];
            const aiResponse = await this.aiService.generateProposal(body, history);
            history.push({ role: 'user', content: body });
            if (aiResponse.tipo === 'solicitud_info') {
                history.push({ role: 'assistant', content: aiResponse.preguntas.join(' ') });
                await this.redis.set(sessionKey, JSON.stringify(history), 'EX', 86400);
                return aiResponse.preguntas.join('\n');
            }
            await this.redis.del(sessionKey);
            if (aiResponse.tipo === 'cotizacion_preliminar') {
                return this.formatTechnicalResponse(aiResponse);
            }
            return aiResponse.resumen_para_comercial || 'Gracias por tu consulta. Un asesor técnico te contactará pronto.';
        }
        catch (error) {
            this.logger.error('Error handling WhatsApp message', error);
            return 'Lo siento, estamos experimentando dificultades técnicas. Por favor, intente más tarde.';
        }
    }
    formatTechnicalResponse(response) {
        const min = response.propuesta.total_estimado_usd.min;
        const max = response.propuesta.total_estimado_usd.max;
        return `🏭 *PROPUESTA VELO ARGENTINA*\n\n` +
            `✅ *Proyecto:* ${response.proyecto.descripcion}\n` +
            `💰 *Inversión estimada:* USD ${min.toLocaleString()} - ${max.toLocaleString()}\n` +
            `⏱️ *Plazo fabricación:* ${response.propuesta.tiempo_total_semanas} semanas\n\n` +
            `Un asesor comercial te enviará el PDF detallado por este medio en breve.`;
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(leads_entity_1.Lead)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        ai_service_1.AiService,
        cotizacion_service_1.CotizacionService,
        typeorm_2.Repository])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map