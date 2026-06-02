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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionItem = exports.Cotizacion = void 0;
const typeorm_1 = require("typeorm");
const leads_entity_1 = require("../leads/leads.entity");
let Cotizacion = class Cotizacion {
    id;
    leadId;
    lead;
    numeroCotizacion;
    division;
    descripcionProyecto;
    nivelAutomatizacion;
    tipoInstalacion;
    totalEstimadoUsdMin;
    totalEstimadoUsdMax;
    tiempoFabricacionSemanas;
    requiereVisitaTecnica;
    prioridadComercial;
    estado;
    aiResponse;
    pdfUrl;
    notasInternas;
    asignadoA;
    created_at;
    updated_at;
    items;
};
exports.Cotizacion = Cotizacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cotizacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lead_id', nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "leadId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leads_entity_1.Lead, (lead) => lead.cotizaciones),
    (0, typeorm_1.JoinColumn)({ name: 'lead_id' }),
    __metadata("design:type", leads_entity_1.Lead)
], Cotizacion.prototype, "lead", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_cotizacion', unique: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "numeroCotizacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "division", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'descripcion_proyecto', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "descripcionProyecto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nivel_automatizacion', length: 50, nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "nivelAutomatizacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_instalacion', length: 50, nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "tipoInstalacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_estimado_usd_min', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "totalEstimadoUsdMin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_estimado_usd_max', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "totalEstimadoUsdMax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tiempo_fabricacion_semanas', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "tiempoFabricacionSemanas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requiere_visita_tecnica', default: false }),
    __metadata("design:type", Boolean)
], Cotizacion.prototype, "requiereVisitaTecnica", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prioridad_comercial', length: 10, default: 'media' }),
    __metadata("design:type", String)
], Cotizacion.prototype, "prioridadComercial", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, default: 'nueva' }),
    __metadata("design:type", String)
], Cotizacion.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ai_response', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Cotizacion.prototype, "aiResponse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pdf_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "pdfUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notas_internas', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "notasInternas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asignado_a', length: 100, nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "asignadoA", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Cotizacion.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Cotizacion.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CotizacionItem, (item) => item.cotizacion),
    __metadata("design:type", Array)
], Cotizacion.prototype, "items", void 0);
exports.Cotizacion = Cotizacion = __decorate([
    (0, typeorm_1.Entity)('cotizaciones')
], Cotizacion);
let CotizacionItem = class CotizacionItem {
    id;
    cotizacionId;
    cotizacion;
    descripcion;
    detalleTecnico;
    precioMinUsd;
    precioMaxUsd;
    tiempoFabricacionSemanas;
    orden;
};
exports.CotizacionItem = CotizacionItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CotizacionItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cotizacion_id' }),
    __metadata("design:type", String)
], CotizacionItem.prototype, "cotizacionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cotizacion, (cotizacion) => cotizacion.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'cotizacion_id' }),
    __metadata("design:type", Cotizacion)
], CotizacionItem.prototype, "cotizacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], CotizacionItem.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'detalle_tecnico', type: 'text', nullable: true }),
    __metadata("design:type", String)
], CotizacionItem.prototype, "detalleTecnico", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'precio_min_usd', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], CotizacionItem.prototype, "precioMinUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'precio_max_usd', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], CotizacionItem.prototype, "precioMaxUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tiempo_fabricacion_semanas', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], CotizacionItem.prototype, "tiempoFabricacionSemanas", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], CotizacionItem.prototype, "orden", void 0);
exports.CotizacionItem = CotizacionItem = __decorate([
    (0, typeorm_1.Entity)('cotizacion_items')
], CotizacionItem);
//# sourceMappingURL=cotizacion.entity.js.map