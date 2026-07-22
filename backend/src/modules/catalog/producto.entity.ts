import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NumericTransformer } from '../../common/numeric.transformer';

const numeric = new NumericTransformer();

export type Division = 'vino' | 'cerveza' | 'industrial' | 'multiple';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  division: Division;

  @Column({ length: 100, nullable: true })
  categoria: string;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // Unidad de medida / venta (ej: "unidad", "litro", "m2", "proyecto")
  @Column({ length: 30, default: 'unidad' })
  unidad: string;

  @Column({
    name: 'costo_base_usd',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
    transformer: numeric,
  })
  costoBaseUsd: number;

  // Margen de ganancia en porcentaje (ej: 35 = 35%)
  @Column({
    name: 'margen_pct',
    type: 'numeric',
    precision: 6,
    scale: 2,
    default: 30,
    transformer: numeric,
  })
  margenPct: number;

  @Column({ name: 'especificaciones', type: 'jsonb', nullable: true })
  especificaciones: Record<string, any>;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
