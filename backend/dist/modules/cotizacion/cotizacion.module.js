"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cotizacion_controller_1 = require("./cotizacion.controller");
const cotizacion_service_1 = require("./cotizacion.service");
const cotizacion_entity_1 = require("./cotizacion.entity");
const leads_entity_1 = require("../leads/leads.entity");
const ai_module_1 = require("../ai/ai.module");
const pdf_module_1 = require("../pdf/pdf.module");
const email_module_1 = require("../email/email.module");
let CotizacionModule = class CotizacionModule {
};
exports.CotizacionModule = CotizacionModule;
exports.CotizacionModule = CotizacionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([cotizacion_entity_1.Cotizacion, cotizacion_entity_1.CotizacionItem, leads_entity_1.Lead]),
            ai_module_1.AiModule,
            pdf_module_1.PdfModule,
            email_module_1.EmailModule,
        ],
        controllers: [cotizacion_controller_1.CotizacionController],
        providers: [cotizacion_service_1.CotizacionService],
        exports: [cotizacion_service_1.CotizacionService],
    })
], CotizacionModule);
//# sourceMappingURL=cotizacion.module.js.map