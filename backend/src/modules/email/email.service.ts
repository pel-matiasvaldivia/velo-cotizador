import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendCotizacionEmail(to: string, cotizacion: any, pdfBuffer: Buffer) {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM'),
        to,
        subject: `Propuesta Técnica Velo Argentina: ${cotizacion.numeroCotizacion}`,
        html: `
          <h1>Hola ${cotizacion.lead.nombre},</h1>
          <p>Adjuntamos el presupuesto preliminar para tu proyecto de <strong>${cotizacion.division}</strong>.</p>
          <p>Nuestra IA ha estimado una inversión de <strong>USD ${cotizacion.totalEstimadoUsdMin.toLocaleString()} - ${cotizacion.totalEstimadoUsdMax.toLocaleString()}</strong>.</p>
          <p>Un asesor comercial de Velo Argentina se pondrá en contacto con vos a la brevedad para ajustar los detalles técnicos.</p>
          <br/>
          <p>Saludos,<br/>Equipo de Velo Argentina</p>
        `,
        attachments: [
          {
            filename: `Cotizacion_${cotizacion.numeroCotizacion}.pdf`,
            content: pdfBuffer,
          },
        ],
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error('Error sending email', error);
    }
  }
}
