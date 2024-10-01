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
  IApiResponse,
  NOTIFICATIONS_SERVICE,
  UserDocument,
  UserRoles,
  UserStatus,
} from '@app/common';
import {
  ChangePasswordDto,
  CreateSADto,
  CreateUserDto,
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

  async createSA({
    firstName,
    lastName,
    username,
    email,
    password,
    roles,
    status,
  }: CreateSADto) {
    const SAExists = await this.usersService.isSuperAdminPresent();
    if (SAExists) throw new BadRequestException(`Link is not available`);
    const saDto = {
      firstName,
      lastName,
      username,
      email,
      password: await bcrypt.hash(password, this.SALT),
      roles,
      status,
    };
    try {
      const sa = await this.usersService.createSA(saDto);
      if (sa) return { statusCode: 201, message: 'SA created' };
    } catch (error) {
      throw new BadRequestException(`Link is not available`);
    }
  }

  async signup(user: UserDocument, createUserDto: CreateUserDto) {
    let newUser;
    if (user.roles.includes(UserRoles.SA)) {
      newUser = await this.usersService.create({
        ...createUserDto,
        roles: [UserRoles.ADMINISTRATOR],
      });
    } else if (user.roles.includes(UserRoles.ADMINISTRATOR)) {
      newUser = await this.usersService.create({
        ...createUserDto,
        dependence: user.dependence,
      });
    }
    const { password, firstName, email } = newUser;

    const token = this.createNotificationToken(email);
    const uri = `${this.configService.get(
      'FRONTEND_URI',
    )}/email-activation?token=${token}`;
    this.notificationsService.emit('notify_email', {
      email,
      subject: 'Valida tu email e ingresa a Yurumi',
      text: `
      Estimado/a ${firstName},\n
      Por favor haga click en el enlace para confirmar su correo electrónico:\n

        * ${uri}\n

      Éste enlace tiene una duración de 72 hs. tras lo cual deberá comunicarse con el administrador para obtener otro.\n

      Luego puede ingresar a la plataforma con las siguientes credenciales:
        * usuario: <su email>
        * clave: ${password}

      Si usted no solicito éste email tan solo ignorelo.\n
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

  async login(user: UserDocument, response: Response): Promise<IApiResponse> {
    return await this.refreshTokens(user._id.toString(), response);
  }

  async changePassword(_id: string, changePasswordDto: ChangePasswordDto) {
    return await this.usersService.changePassword(_id, changePasswordDto);
  }

  async refreshTokens(_id: string, response: Response) {
    const user = await this.usersService.getUser({ _id });
    const { accessToken, refreshToken } = await this.getTokens(user);
    await this.usersService.updateCurrentUser(_id, {
      refreshToken,
    });
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 900000,
    });
    response.cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 604800000,
    });
    return { statusCode: 200, message: 'Refresh token done' };
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

  private generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });
  }

  private generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });
  }

  private async getTokens(user: UserDocument) {
    const payload = {
      userId: user._id.toHexString(),
    };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
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
