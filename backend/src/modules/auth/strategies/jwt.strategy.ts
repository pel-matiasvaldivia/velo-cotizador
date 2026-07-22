import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { AuthUser } from '../decorators/current-user.decorator';

export interface JwtPayload {
  sub: string;
  email: string;
  rol: 'admin' | 'comercial';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'velo-dev-secret-change-me',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user || !user.activo) {
      throw new UnauthorizedException('Usuario inactivo o inexistente');
    }
    return {
      id: user.id,
      email: user.email,
      rol: user.rol,
      nombre: user.nombre,
    };
  }
}
