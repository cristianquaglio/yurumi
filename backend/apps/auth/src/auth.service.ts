import { Response } from 'express';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';

import {
  generatePassword,
  NOTIFICATIONS_SERVICE,
  UserDocument,
  UserRoles,
  UserStatus,
} from '@app/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  ICreateUserPayload,
  IEmailActivationPayload,
  UsersService,
} from './users';
import { RecoverAccountDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private SALT: number = 10;

  async signup(
    createUserPayload: ICreateUserPayload,
    createUserDto: CreateUserDto,
  ) {
    const { dependence } = createUserPayload;
    const hasAdmin = await this.usersService.dependenceHasUsers(
      createUserPayload,
    );
    let returnedUser: UserDocument;
    if (!hasAdmin)
      returnedUser = await this.usersService.create(dependence, {
        ...createUserDto,
        roles: [UserRoles.ADMINISTRATOR],
      });
    else
      returnedUser = await this.usersService.create(dependence, {
        ...createUserDto,
      });
    const { email, firstName } = returnedUser;

    const token = this.createNotificationToken(email);
    const uri = `${this.configService.get(
      'AUTH_URI',
    )}/email-activation?token=${token}`;
    this.notificationsService.emit('notify_email', {
      email,
      subject: 'Validate your email to activate your account',
      text: `
      Dear ${firstName},\n
      Please click below to confirm your account:\n
      
        * ${uri}\n
      
      This link has a duration of 72 hours. After that you will need to contact
        with your admin.\n
      If you did not request this email you can safely ignore it.\n
      `,
    });

    return { message: 'User created', statusCode: 201 };
  }

  async emailActivation(emailActivationPayload: IEmailActivationPayload) {
    const { token } = emailActivationPayload;
    const email = await this.extractEmailFromToken(token);
    const user = await this.usersService.activateEmail(email);
    if (user) {
      this.notificationsService.emit('notify_email', {
        email,
        subject: 'Your email was validated successfully',
        text: `
        Dear ${user.firstName},\n
        Your email was validated, now you can login.\n
        `,
      });
      return { statusCode: 200, message: 'User email confirmated' };
    }
  }

  async login(user: UserDocument, response: Response) {
    const refreshToken = await this.generateTokens(user, response);
    await this.usersService.updateCurrentUser(user._id.toString(), {
      refreshToken,
    });
  }

  async changePassword(_id: string, changePasswordDto: ChangePasswordDto) {
    return await this.usersService.changePassword(_id, changePasswordDto);
  }

  async refreshTokens(_id: string, response: Response) {
    const user = await this.usersService.getUser({ _id });
    const refreshToken = await this.generateTokens(user, response);
    await this.usersService.updateCurrentUser(user._id.toString(), {
      refreshToken,
    });
    return { statusCode: 204, message: 'Refresh token done' };
  }

  async recoverAccount(recoverAccountDto: RecoverAccountDto) {
    const { email } = recoverAccountDto;

    const user = await this.usersService.getUserByEmail(email);
    if (user.status !== UserStatus.ACTIVE)
      throw new UnauthorizedException(`User is not active`);
    const generatedPassword = generatePassword();
    const temporaryPassword = bcrypt.hashSync(generatedPassword, this.SALT);
    await this.usersService.updateCurrentUser(user._id.toString(), {
      password: temporaryPassword,
      isPasswordChanged: false,
    });
    this.notificationsService.emit('notify_email', {
      email,
      subject: 'Recover your account',
      text: `
        Dear ${user.firstName},\n
        Your new password has been generated automatically:\n
          * email: ${user.email}
        
          * password: ${generatedPassword}\n
        
        Do not share this values.\n
        We suggest to change this value for another one more friendly for you.\n
        `,
    });
    return {
      statusCode: 200,
      message: `A email was sended to you with the new credentials`,
    };
  }

  async logout(_id: string) {
    const user = await this.usersService.updateCurrentUser(_id, {
      refreshToken: null,
    });
    if (user) return { statusCode: 200, message: 'User logged out' };
  }

  private async generateTokens(user: UserDocument, response: Response) {
    const tokenPayload = {
      userId: user._id.toHexString(),
    };
    const refreshTokenPayload = {
      userId: user._id.toHexString(),
    };
    const tokenExpiration = new Date();
    tokenExpiration.setSeconds(
      tokenExpiration.getSeconds() +
        this.configService.get<number>('JWT_EXPIRATION'),
    );
    const refreshTokenExpiration = new Date();
    refreshTokenExpiration.setSeconds(
      refreshTokenExpiration.getSeconds() +
        this.configService.get<number>('JWT_REFRESH_EXPIRATION'),
    );
    const token = this.jwtService.sign(tokenPayload);
    const refreshToken = this.jwtService.sign(refreshTokenPayload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires: tokenExpiration,
    });
    response.cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      expires: refreshTokenExpiration,
    });
    return refreshToken;
  }

  private async extractEmailFromToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('EMAIL_VERIFICATION_TOKEN'),
      });
      if (typeof payload === 'object' && 'email' in payload)
        return payload.email;
      throw new BadRequestException(
        `Email confirmation token broken or expired`,
      );
    } catch (error) {
      if (error?.name === 'TokenExpiredError')
        throw new BadRequestException(
          `Email confirmation token broken or expired`,
        );
      throw new BadRequestException(
        `Email confirmation token broken or expired`,
      );
    }
  }

  private createNotificationToken(email: string) {
    return this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('EMAIL_VERIFICATION_TOKEN'),
        expiresIn: this.configService.get('EMAIL_VERIFICATION_EXPIRATION_TIME'),
      },
    );
  }
}
