import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import {
  ICreateUserPayload,
  IEmailActivationPayload,
} from './users/interfaces';

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
}
