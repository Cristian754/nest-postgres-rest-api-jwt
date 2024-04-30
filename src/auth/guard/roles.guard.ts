import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflactor: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflactor.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!role) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return role === user.role;
  }
}
