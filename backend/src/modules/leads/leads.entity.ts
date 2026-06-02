import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Cotizacion } from '../cotizacion/cotizacion.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  nombre: string;

  @Column({ length: 200, nullable: true })
  empresa: string;

  @Column({ length: 200 })
  email: string;

  @Column({ length: 50, nullable: true })
  telefono: string;

  @Column({ length: 100, nullable: true })
  provincia: string;

  @Column({ length: 100, nullable: true })
  como_conocio: string;

  @Column({ length: 20 })
  canal: 'web' | 'whatsapp';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Cotizacion, (cotizacion) => cotizacion.lead)
  cotizaciones: Cotizacion[];
}
