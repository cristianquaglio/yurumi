import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { AUTH_SERVICE, UserRoles } from '../constants';
import { UserDto } from '../dto';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;
    if (!jwt) return false;

    const roles = this.reflector.get<UserRoles[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          if (roles && roles.length > 0) {
            const hasRole = roles.some((role) => res.roles?.includes(role));
            if (!hasRole) {
              this.logger.error('The user does not have valid roles.');
              throw new UnauthorizedException();
            }
          }
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
