import { Repository, DataSource } from 'typeorm';
import { Cotizacion } from './cotizacion.entity';
import { Lead } from '../leads/leads.entity';
import { AiService } from '../ai/ai.service';
import { PdfService } from '../pdf/pdf.service';
import { EmailService } from '../email/email.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
export declare class CotizacionService {
    private cotizacionRepository;
    private leadRepository;
    private aiService;
    private pdfService;
    private emailService;
    private dataSource;
    private readonly logger;
    constructor(cotizacionRepository: Repository<Cotizacion>, leadRepository: Repository<Lead>, aiService: AiService, pdfService: PdfService, emailService: EmailService, dataSource: DataSource);
    create(createDto: CreateCotizacionDto): Promise<Cotizacion | null>;
    findOne(id: string): Promise<Cotizacion | null>;
    private generateAndSend;
}
