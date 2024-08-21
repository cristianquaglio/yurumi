import { Response } from 'express';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

import { NOTIFICATIONS_SERVICE, UserDocument, UserRoles } from '@app/common';
import { CreateUserDto, ChangePasswordDto } from './users/dto';
import { UsersService } from './users/users.service';
import {
  ICreateUserPayload,
  IEmailActivationPayload,
} from './users/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(
    createUserPayload: ICreateUserPayload,
    createUserDto: CreateUserDto,
  ) {
    const { dependence } = createUserPayload;
    const isAdmin = await this.usersService.dependenceHasUsers(dependence);
    let returnedUser: UserDocument;
    if (!isAdmin)
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
    if (user) return { statusCode: 200, message: 'User email confirmated' };
  }

  async login(user: UserDocument, response: Response) {
    const tokenPayload = {
      userId: user._id.toHexString(),
    };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get<number>('JWT_EXPIRATION'),
    );
    const token = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  async changePassword(_id: string, changePasswordDto: ChangePasswordDto) {
    return await this.usersService.changePassword(_id, changePasswordDto);
  }

  private async extractEmailFromToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('EMAIL_VERIFICATION_TOKEN'),
      });
      if (typeof payload === 'object' && 'email' in payload)
        return payload.email;
      throw new BadRequestException(`Bad confirmation token`);
    } catch (error) {
      if (error?.name === 'TokenExpiredError')
        throw new BadRequestException(`Email confirmation token expired`);
      throw new BadRequestException(`Bad confirmation token`);
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
