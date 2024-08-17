import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';

import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DependencesModule } from './dependences/dependences.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        AUTH_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        EMAIL_VERIFICATION_TOKEN: Joi.string().required(),
        EMAIL_VERIFICATION_EXPIRATION_TIME: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
        NOTIFICATIONS_HOST: Joi.string().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
      }),
      envFilePath: './apps/auth/.env',
    }),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATIONS_HOST'),
            port: configService.get('NOTIFICATIONS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    DependencesModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
