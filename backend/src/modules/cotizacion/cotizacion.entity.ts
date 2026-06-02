import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Lead } from '../leads/leads.entity';

@Entity('cotizaciones')
export class Cotizacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lead_id', nullable: true })
  leadId: string;

  @ManyToOne(() => Lead, (lead) => lead.cotizaciones)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column({ name: 'numero_cotizacion', unique: true })
  numeroCotizacion: string;

  @Column({ length: 20 })
  division: 'vino' | 'cerveza' | 'industrial' | 'multiple';

  @Column({ name: 'descripcion_proyecto', type: 'text', nullable: true })
  descripcionProyecto: string;

  @Column({ name: 'nivel_automatizacion', length: 50, nullable: true })
  nivelAutomatizacion: string;

  @Column({ name: 'tipo_instalacion', length: 50, nullable: true })
  tipoInstalacion: string;

  @Column({ name: 'total_estimado_usd_min', type: 'integer', nullable: true })
  totalEstimadoUsdMin: number;

  @Column({ name: 'total_estimado_usd_max', type: 'integer', nullable: true })
  totalEstimadoUsdMax: number;

  @Column({ name: 'tiempo_fabricacion_semanas', type: 'integer', nullable: true })
  tiempoFabricacionSemanas: number;

  @Column({ name: 'requiere_visita_tecnica', default: false })
  requiereVisitaTecnica: boolean;

  @Column({ name: 'prioridad_comercial', length: 10, default: 'media' })
  prioridadComercial: string;

  @Column({ length: 30, default: 'nueva' })
  estado: 'nueva' | 'revisada' | 'enviada' | 'en_negociacion' | 'ganada' | 'perdida' | 'archivada';

  @Column({ name: 'ai_response', type: 'jsonb', nullable: true })
  aiResponse: any;

  @Column({ name: 'pdf_url', type: 'text', nullable: true })
  pdfUrl: string;

  @Column({ name: 'notas_internas', type: 'text', nullable: true })
  notasInternas: string;

  @Column({ name: 'asignado_a', length: 100, nullable: true })
  asignadoA: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CotizacionItem, (item) => item.cotizacion)
  items: CotizacionItem[];
}

@Entity('cotizacion_items')
export class CotizacionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cotizacion_id' })
  cotizacionId: string;

  @ManyToOne(() => Cotizacion, (cotizacion) => cotizacion.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion: Cotizacion;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ name: 'detalle_tecnico', type: 'text', nullable: true })
  detalleTecnico: string;

  @Column({ name: 'precio_min_usd', type: 'integer', nullable: true })
  precioMinUsd: number;

  @Column({ name: 'precio_max_usd', type: 'integer', nullable: true })
  precioMaxUsd: number;

  @Column({ name: 'tiempo_fabricacion_semanas', type: 'integer', nullable: true })
  tiempoFabricacionSemanas: number;

  @Column({ default: 0 })
  orden: number;
}
