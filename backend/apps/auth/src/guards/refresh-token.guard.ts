import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.RefreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const { userId } = decoded;
      request.user = await this.usersService.getUser({ _id: userId });
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
