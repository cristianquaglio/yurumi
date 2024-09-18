import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';

import { PatientsModule } from './patients.module';

async function main() {
  const app = await NestFactory.create(PatientsModule);

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Patients API')
    .setDescription(
      'This microservice performs many tasks related to search and save patients on Yurumi',
    )
    .setVersion('1.0')
    .addCookieAuth('Authentication')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useLogger(app.get(Logger));

  app.use(cookieParser());

  app.enableCors({
    origin: configService.get('FRONTEND_URI'),
    credentials: true,
  });

  await app.listen(configService.get('HTTP_PORT'));
}
main();
