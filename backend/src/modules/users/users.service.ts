import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Shape returned to clients: never expose the password hash.
export type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Seed an initial admin so the portal is usable on first boot.
  // Wrapped defensively: if the `usuarios` table doesn't exist yet (an existing
  // deployment where 002_portal.sql hasn't been applied), we log instead of
  // crashing the whole backend.
  async onModuleInit() {
    try {
      const count = await this.usersRepository.count();
      if (count > 0) return;

      const email = process.env.ADMIN_EMAIL || 'admin@velo-argentina.com.ar';
      const password = process.env.ADMIN_PASSWORD || 'velo-admin';
      const passwordHash = await bcrypt.hash(password, 10);

      await this.usersRepository.save(
        this.usersRepository.create({
          nombre: 'Administrador',
          email,
          passwordHash,
          rol: 'admin',
          activo: true,
        }),
      );
      this.logger.warn(
        `Usuario admin inicial creado (${email}). Cambiá la contraseña luego del primer login.`,
      );
    } catch (error) {
      this.logger.error(
        'No se pudo inicializar la tabla de usuarios. ' +
          'Si es un despliegue existente, aplicá database/migrations/002_portal.sql.',
        error instanceof Error ? error.message : error,
      );
    }
  }

  static toSafe(user: User): SafeUser {
    const { passwordHash: _omit, ...safe } = user;
    return safe;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find({
      order: { created_at: 'DESC' },
    });
    return users.map((u) => UsersService.toSafe(u));
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return UsersService.toSafe(user);
  }

  async create(dto: CreateUserDto): Promise<SafeUser> {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Ya existe un usuario con ese email');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      passwordHash,
      rol: dto.rol ?? 'comercial',
      activo: true,
    });
    const saved = await this.usersRepository.save(user);
    return UsersService.toSafe(saved);
  }

  async update(id: string, dto: UpdateUserDto): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.email && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) throw new ConflictException('Ya existe un usuario con ese email');
      user.email = dto.email;
    }
    if (dto.nombre !== undefined) user.nombre = dto.nombre;
    if (dto.rol !== undefined) user.rol = dto.rol;
    if (dto.activo !== undefined) user.activo = dto.activo;
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 10);

    const saved = await this.usersRepository.save(user);
    return UsersService.toSafe(saved);
  }

  async remove(id: string): Promise<SafeUser> {
    // Soft-disable rather than hard-delete to preserve assignment history.
    return this.update(id, { activo: false });
  }
}
