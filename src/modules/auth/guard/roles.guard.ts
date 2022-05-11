import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/role.decorator';
import { ROLE } from '../role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user }: { user?: { username: string; uid: string; role: number } } =
      context.switchToHttp().getRequest();
    if (requiredRoles) {
      return user?.role >= requiredRoles;
    } else {
      return true;
    }
  }
}
