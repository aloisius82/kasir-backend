import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../user/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | Role>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const { user } = context.switchToHttp().getRequest();

    // Flatten the array in case of nested arrays and check for the role.
    return roles.flat().some((role) => user.role === role);
  }
}
