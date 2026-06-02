import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendCotizacionEmail(to: string, cotizacion: any, pdfBuffer: Buffer): Promise<void>;
}
