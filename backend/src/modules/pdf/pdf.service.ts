import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async generateCotizacionPdf(cotizacion: any): Promise<Buffer> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    const html = this.generateHtml(cotizacion);
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '2cm', bottom: '2cm', left: '1cm', right: '1cm' },
    });

    await browser.close();
    return Buffer.from(pdf);
  }

  private generateHtml(data: any): string {
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
}
