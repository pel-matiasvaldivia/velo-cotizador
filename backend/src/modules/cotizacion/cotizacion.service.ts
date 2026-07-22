import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cotizacion, CotizacionItem } from './cotizacion.entity';
import { Lead } from '../leads/leads.entity';
import { AiService } from '../ai/ai.service';
import { PdfService } from '../pdf/pdf.service';
import { EmailService } from '../email/email.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { QueryCotizacionDto } from './dto/query-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';

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

  // ---- Admin / portal comercial ----

  async findAll(query: QueryCotizacionDto) {
    const page = Math.max(parseInt(query.page || '1', 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit || '20', 10) || 20, 1), 100);

    const qb = this.cotizacionRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.lead', 'lead')
      .orderBy('c.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.division) qb.andWhere('c.division = :division', { division: query.division });
    if (query.estado) qb.andWhere('c.estado = :estado', { estado: query.estado });
    if (query.prioridad)
      qb.andWhere('c.prioridadComercial = :prioridad', { prioridad: query.prioridad });
    if (query.search) {
      qb.andWhere(
        '(c.numeroCotizacion ILIKE :s OR lead.nombre ILIKE :s OR lead.empresa ILIKE :s OR lead.email ILIKE :s)',
        { s: `%${query.search}%` },
      );
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id: string, dto: UpdateCotizacionDto) {
    const cotizacion = await this.cotizacionRepository.findOne({ where: { id } });
    if (!cotizacion) throw new NotFoundException('Cotización no encontrada');
    Object.assign(cotizacion, dto);
    await this.cotizacionRepository.save(cotizacion);
    return this.findOne(id);
  }

  async getStats() {
    const porEstado = await this.cotizacionRepository
      .createQueryBuilder('c')
      .select('c.estado', 'estado')
      .addSelect('COUNT(*)', 'total')
      .groupBy('c.estado')
      .getRawMany();

    const porDivision = await this.cotizacionRepository
      .createQueryBuilder('c')
      .select('c.division', 'division')
      .addSelect('COUNT(*)', 'total')
      .groupBy('c.division')
      .getRawMany();

    const total = await this.cotizacionRepository.count();
    const totalLeads = await this.leadRepository.count();

    return {
      total,
      totalLeads,
      porEstado: porEstado.map((r) => ({ estado: r.estado, total: Number(r.total) })),
      porDivision: porDivision.map((r) => ({
        division: r.division,
        total: Number(r.total),
      })),
    };
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
