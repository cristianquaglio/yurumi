import { Body, Controller, Post, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { ICreateUserPayload } from './users/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(
    @Query() createUserPayload: ICreateUserPayload,
    @Body() createUserDto: CreateUserDto,
  ) {
    this.authService.signup(createUserPayload, createUserDto);
  }
}
