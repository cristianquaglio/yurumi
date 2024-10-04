import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUSer, UserDocument } from '@app/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  CreateSADto,
  CreateUserDto,
  IEmailActivationPayload,
} from './users';
import { JwtAuthGuard, LocalAuthGuard, RefreshTokenGuard } from './guards';
import { LoginDto, RecoverAccountDto } from './dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-sa')
  @ApiOperation({ summary: 'Create Super Admin user' })
  @ApiResponse({
    status: 201,
    description: 'SA created',
    example: {
      statusCode: 201,
      message: 'SA created',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Link is not available',
    example: {
      statusCode: 400,
      message: 'Link is not available',
      error: 'Bad Request',
    },
  })
  createSA(@Body() createSADto: CreateSADto) {
    return this.authService.createSA(createSADto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signup')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created',
    example: { statusCode: 201, message: 'User created' },
  })
  @ApiResponse({
    status: 401,
    description: 'Duplicated data in database',
    example: {
      statusCode: 401,
      message: 'Duplicated data in database',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: {
      statusCode: 400,
      message: [
        'firstName should not be empty',
        'firstName must be a string',
        'lastName should not be empty',
        'lastName must be a string',
        'email must be an email',
      ],
      error: 'Bad Request',
    },
  })
  signup(@Req() request: Request, @Body() createUserDto: CreateUserDto) {
    return this.authService.signup(request.user as UserDocument, createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: "Initiate user's session" })
  @ApiResponse({
    status: 200,
    description: 'User logged in',
    example: { statusCode: 200, message: 'User logged in' },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      message: 'Credentials are not valid || User is not active',
      error: 'Unauthorized',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Document was not found',
    example: {
      statusCode: 404,
      message: 'Document was not found',
      error: 'Not Found',
    },
  })
  async login(
    @Body() loginDto: LoginDto,
    @CurrentUSer() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    let { statusCode, message } = await this.authService.login(user, response);
    message = 'User logged in';
    response.send({ statusCode, message });
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: {
      firstName: 'Cristian',
      lastName: 'Quagliozzi',
      email: 'cristianquaglio@gmail.com',
      dependence: '66d1d6d78cfc99e93c2f5f84',
      roles: ['SA'],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  getUser(@CurrentUSer() user: UserDocument) {
    if (!user) throw new UnauthorizedException();
    const { firstName, lastName, email, dependence, roles } = user;
    return { firstName, lastName, email, dependence, roles };
  }

  @Get('email-activation')
  @ApiOperation({ summary: 'Activate an account email' })
  @ApiResponse({
    status: 200,
    description: 'User email confirmated',
    example: { statusCode: 200, message: 'User email confirmated' },
  })
  @ApiResponse({
    status: 400,
    description: 'Email confirmation token broken or expired',
    example: {
      statusCode: 400,
      message: 'Email confirmation token broken or expired',
      error: 'Bad Request',
    },
  })
  @ApiQuery({ name: 'token', type: String, required: true })
  emailActivation(@Query() emailActivationPayload: IEmailActivationPayload) {
    return this.authService.emailActivation(emailActivationPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiCookieAuth()
  @ApiOperation({ summary: "Change user's password" })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    example: {
      statusCode: 200,
      message: 'Password changed successfully',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User is not active',
    example: {
      statusCode: 401,
      message: 'User is not active',
      error: 'Unauthorized',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: {
      statusCode: 400,
      message:
        "Password can't be the same one || ['password is not strong enough']",
      error: 'Bad Request',
    },
  })
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
  @ApiCookieAuth()
  @ApiOperation({ summary: "Refresh user's token" })
  @ApiResponse({
    status: 204,
    description: 'Refresh token done',
    example: { statusCode: 204, message: 'Refresh token done' },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      message: 'No refresh token provided || Invalid refresh token',
      error: 'Unauthorized',
    },
  })
  refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshTokens(request.user['_id'], response);
  }

  @Post('recover-account')
  @ApiOperation({ summary: "Recover user's account" })
  @ApiResponse({
    status: 200,
    description: 'A email was sended to you with the new credentials',
    example: {
      statusCode: 200,
      message: 'A email was sended to you with the new credentials',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: {
      statusCode: 400,
      message: ['email must be an email'],
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User is not active',
    example: {
      statusCode: 401,
      message: 'User is not active',
      error: 'Unauthorized',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Document was not found',
    example: {
      statusCode: 404,
      message: 'Document was not found',
      error: 'Not Found',
    },
  })
  recoverAccount(@Body() recoverAccountDto: RecoverAccountDto) {
    return this.authService.recoverAccount(recoverAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @Get('logout')
  @ApiOperation({ summary: "Logout user's session" })
  @ApiResponse({
    status: 200,
    description: 'User logged out',
    example: {
      statusCode: 200,
      message: 'OK',
    },
  })
  logout(@Res() res: Response) {
    res.clearCookie('Authentication', { httpOnly: true, path: '/' });
    res.clearCookie('RefreshToken', { httpOnly: true, path: '/' });
    return res.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
