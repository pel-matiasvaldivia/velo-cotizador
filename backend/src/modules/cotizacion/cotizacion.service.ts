import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cotizacion, CotizacionItem } from './cotizacion.entity';
import { Lead } from '../leads/leads.entity';
import { AiService } from '../ai/ai.service';
import { PdfService } from '../pdf/pdf.service';
import { EmailService } from '../email/email.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';

@Injectable()
export class CotizacionService {
  private readonly logger = new Logger(CotizacionService.name);

  constructor(
    @InjectRepository(Cotizacion)
    private cotizacionRepository: Repository<Cotizacion>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    private aiService: AiService,
    private pdfService: PdfService,
    private emailService: EmailService,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateCotizacionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Find or create lead
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

      // 2. Generate AI proposal
      const aiResponse = await this.aiService.generateProposal(createDto.descripcionProyecto);

      // 3. Create Cotizacion
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

      // 4. Create items
      if (aiResponse.propuesta?.items) {
        const items = aiResponse.propuesta.items.map((item, index) => {
          return queryRunner.manager.create(CotizacionItem, {
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
        // Post-process: Generate PDF and Send Email (Asynchronous)
        this.generateAndSend(fullCotizacion).catch(err => 
          this.logger.error('Background process failed', err)
        );
      }

      return fullCotizacion;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error creating cotizacion', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string) {
    return this.cotizacionRepository.findOne({
      where: { id },
      relations: { lead: true, items: true },
    });
  }

  private async generateAndSend(cotizacion: Cotizacion) {
    try {
      const pdfBuffer = await this.pdfService.generateCotizacionPdf(cotizacion);
      // Here we would also upload to MinIO and get a URL
      
      await this.emailService.sendCotizacionEmail(cotizacion.lead.email, cotizacion, pdfBuffer);
      this.logger.log(`Cotización ${cotizacion.numeroCotizacion} processed and sent.`);
    } catch (error) {
      this.logger.error('Error in generateAndSend', error);
    }
  }
}
