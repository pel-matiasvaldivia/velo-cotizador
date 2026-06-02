"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var PdfService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = __importStar(require("puppeteer"));
let PdfService = PdfService_1 = class PdfService {
    logger = new common_1.Logger(PdfService_1.name);
    async generateCotizacionPdf(cotizacion) {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        const html = this.generateHtml(cotizacion);
        await page.setContent(html, { waitUntil: 'load' });
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '2cm', bottom: '2cm', left: '1cm', right: '1cm' },
        });
        await browser.close();
        return Buffer.from(pdf);
    }
    generateHtml(data) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica', sans-serif; color: #1a1a2e; }
          .header { text-align: center; border-bottom: 2px solid #0f3460; padding-bottom: 20px; }
          .logo { color: #0f3460; font-size: 24px; font-weight: bold; }
          .accent { color: #e94560; }
          .section { margin-top: 30px; }
          .section-title { background: #0f3460; color: white; padding: 5px 10px; font-size: 14px; text-transform: uppercase; }
          .item { margin-bottom: 15px; border-bottom: 1px solid #c0c0c0; padding-bottom: 10px; }
          .price-block { background: #f5f5f5; padding: 20px; text-align: right; margin-top: 30px; }
          .footer { font-size: 10px; color: #333; margin-top: 50px; text-align: center; border-top: 1px solid #c0c0c0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">VELO <span class="accent">ARGENTINA</span></div>
          <p>COTIZACIÓN TÉCNICA PRELIMINAR: ${data.numeroCotizacion}</p>
        </div>

        <div class="section">
          <div class="section-title">Datos del Cliente</div>
          <p><strong>Nombre:</strong> ${data.lead.nombre}</p>
          <p><strong>Empresa:</strong> ${data.lead.empresa || 'Particular'}</p>
          <p><strong>Proyecto:</strong> ${data.descripcionProyecto}</p>
        </div>

        <div class="section">
          <div class="section-title">Equipamiento Propuesto</div>
          ${data.items.map(item => `
            <div class="item">
              <p><strong>${item.descripcion}</strong></p>
              <p style="font-size: 12px; color: #555;">${item.detalleTecnico}</p>
              <p>Rango estimado: USD ${item.precioMinUsd.toLocaleString()} - ${item.precioMaxUsd.toLocaleString()}</p>
            </div>
          `).join('')}
        </div>

        <div class="price-block">
          <h2 style="margin: 0;">TOTAL ESTIMADO</h2>
          <h1 style="color: #0f3460; margin: 5px 0;">USD ${data.totalEstimadoUsdMin.toLocaleString()} - ${data.totalEstimadoUsdMax.toLocaleString()}</h1>
          <p>Plazo de entrega: ${data.tiempoFabricacionSemanas} semanas aprox.</p>
        </div>

        <div class="footer">
          <p>Calle N°7 y Santa Rita, Parque Industrial Eje Norte, Las Heras, Mendoza.</p>
          <p>Esta cotización es preliminar y está sujeta a revisión técnica in situ.</p>
        </div>
      </body>
      </html>
    `;
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = PdfService_1 = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map