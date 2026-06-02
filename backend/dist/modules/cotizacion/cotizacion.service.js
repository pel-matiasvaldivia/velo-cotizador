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
var CotizacionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cotizacion_entity_1 = require("./cotizacion.entity");
const leads_entity_1 = require("../leads/leads.entity");
const ai_service_1 = require("../ai/ai.service");
const pdf_service_1 = require("../pdf/pdf.service");
const email_service_1 = require("../email/email.service");
let CotizacionService = CotizacionService_1 = class CotizacionService {
    cotizacionRepository;
    leadRepository;
    aiService;
    pdfService;
    emailService;
    dataSource;
    logger = new common_1.Logger(CotizacionService_1.name);
    constructor(cotizacionRepository, leadRepository, aiService, pdfService, emailService, dataSource) {
        this.cotizacionRepository = cotizacionRepository;
        this.leadRepository = leadRepository;
        this.aiService = aiService;
        this.pdfService = pdfService;
        this.emailService = emailService;
        this.dataSource = dataSource;
    }
    async create(createDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let lead = await this.leadRepository.findOne({ where: { email: createDto.email } });
            if (!lead) {
                lead = this.leadRepository.create({
                    nombre: createDto.nombre,
                    empresa: createDto.empresa,
                    email: createDto.email,
                    telefono: createDto.telefono,
                    provincia: createDto.provincia,
                    como_conocio: createDto.como_conocio,
                    canal: 'web',
                });
                lead = await queryRunner.manager.save(lead);
            }
            const aiResponse = await this.aiService.generateProposal(createDto.descripcionProyecto);
            const cotizacion = this.cotizacionRepository.create({
                lead,
                division: aiResponse.division || 'multiple',
                descripcionProyecto: createDto.descripcionProyecto,
                nivelAutomatizacion: aiResponse.proyecto?.nivel_automatizacion,
                tipoInstalacion: aiResponse.proyecto?.tipo_instalacion,
                totalEstimadoUsdMin: aiResponse.propuesta?.total_estimado_usd?.min,
                totalEstimadoUsdMax: aiResponse.propuesta?.total_estimado_usd?.max,
                tiempoFabricacionSemanas: aiResponse.propuesta?.tiempo_total_semanas,
                requiereVisitaTecnica: aiResponse.requiere_visita_tecnica,
                prioridadComercial: aiResponse.prioridad_comercial,
                aiResponse: aiResponse,
            });
            const savedCotizacion = await queryRunner.manager.save(cotizacion);
            if (aiResponse.propuesta?.items) {
                const items = aiResponse.propuesta.items.map((item, index) => {
                    return queryRunner.manager.create(cotizacion_entity_1.CotizacionItem, {
                        cotizacionId: savedCotizacion.id,
                        descripcion: item.descripcion,
                        detalleTecnico: item.detalle_tecnico,
                        precioMinUsd: item.rango_precio_usd?.min,
                        precioMaxUsd: item.rango_precio_usd?.max,
                        tiempoFabricacionSemanas: item.tiempo_fabricacion_semanas,
                        orden: index,
                    });
                });
                await queryRunner.manager.save(items);
            }
            await queryRunner.commitTransaction();
            const fullCotizacion = await this.findOne(savedCotizacion.id);
            if (fullCotizacion) {
                this.generateAndSend(fullCotizacion).catch(err => this.logger.error('Background process failed', err));
            }
            return fullCotizacion;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Error creating cotizacion', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findOne(id) {
        return this.cotizacionRepository.findOne({
            where: { id },
            relations: { lead: true, items: true },
        });
    }
    async generateAndSend(cotizacion) {
        try {
            const pdfBuffer = await this.pdfService.generateCotizacionPdf(cotizacion);
            await this.emailService.sendCotizacionEmail(cotizacion.lead.email, cotizacion, pdfBuffer);
            this.logger.log(`Cotización ${cotizacion.numeroCotizacion} processed and sent.`);
        }
        catch (error) {
            this.logger.error('Error in generateAndSend', error);
        }
    }
};
exports.CotizacionService = CotizacionService;
exports.CotizacionService = CotizacionService = CotizacionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cotizacion_entity_1.Cotizacion)),
    __param(1, (0, typeorm_1.InjectRepository)(leads_entity_1.Lead)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        ai_service_1.AiService,
        pdf_service_1.PdfService,
        email_service_1.EmailService,
        typeorm_2.DataSource])
], CotizacionService);
//# sourceMappingURL=cotizacion.service.js.map