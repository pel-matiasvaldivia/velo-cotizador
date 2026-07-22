import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/user.entity';
import { AuthUser } from '../decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // No @Roles() on the route -> any authenticated user is allowed.
    if (!required || required.length === 0) return true;

    const user: AuthUser = context.switchToHttp().getRequest().user;
    if (user && required.includes(user.rol)) return true;

    throw new ForbiddenException('No tenés permisos para esta acción');
  }
}
