import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserRole = 'admin' | 'comercial';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 200, unique: true })
  email: string;

  // Never returned in API responses (see UsersService serialization).
  @Column({ name: 'password_hash', length: 200 })
  passwordHash: string;

  @Column({ length: 20, default: 'comercial' })
  rol: UserRole;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
