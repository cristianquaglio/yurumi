import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CurrentUSer, UserDocument } from '@app/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  ICreateUserPayload,
  IEmailActivationPayload,
} from './users';
import { JwtAuthGuard, LocalAuthGuard, RefreshTokenGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(
    @Query() createUserPayload: ICreateUserPayload,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.signup(createUserPayload, createUserDto);
  }

  @Get('email-activation')
  emailActivation(@Query() emailActivationPayload: IEmailActivationPayload) {
    return this.authService.emailActivation(emailActivationPayload);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUSer() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.login(user, response);
    response.send(jwt);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: Request,
  ) {
    return this.authService.changePassword(
      request.user['_id'],
      changePasswordDto,
    );
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshTokens(request.user['_id'], response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user['_id']);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
