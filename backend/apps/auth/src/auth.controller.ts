import { Response } from 'express';
import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';

import { CurrentUSer, UserDocument } from '@app/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import {
  ICreateUserPayload,
  IEmailActivationPayload,
} from './users/interfaces';
import { LocalAuthGuard } from './guards/local-auth.guard';

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
}
