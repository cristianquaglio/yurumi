import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthModule } from '../src';

describe('Auth Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('AuthController', () => {
    it('/auth/signup (POST) should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          username: 'jane.doe',
          password: 'Admin123*1',
        })
        .expect(201);

      expect(response.body).toEqual({
        message: 'User created',
        statusCode: 201,
      });
    });

    it('/auth/login (POST) should log in a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'jane.doe',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('/auth/activate-email (POST) should activate user email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/activate-email')
        .send({
          token: 'validToken', // Usa un token válido aquí
        })
        .expect(200);

      expect(response.body).toEqual({
        statusCode: 200,
        message: 'User email confirmated',
      });
    });

    it('/auth/refresh-tokens (POST) should refresh tokens successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh-tokens')
        .send({
          userId: 'userId', // Usa un ID de usuario válido
        })
        .expect(200);

      expect(response.body).toEqual({
        statusCode: 200,
        message: 'Refresh token done',
      });
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('/auth/recover-account (POST) should recover the account and send email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/recover-account')
        .send({
          email: 'jane@example.com',
        })
        .expect(200);

      expect(response.body).toEqual({
        statusCode: 200,
        message: `A email was sended to you with the new credentials`,
      });
    });

    it('/auth/logout (POST) should log out the user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .send({
          userId: 'userId', // Usa un ID de usuario válido
        })
        .expect(200);

      expect(response.body).toBeTruthy();
    });

    it('/auth/change-password (POST) should change user password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/change-password')
        .send({
          userId: 'userId', // Usa un ID de usuario válido
          password: 'oldPassword',
          newPassword: 'newPassword123',
        })
        .expect(200);

      expect(response.body).toBeTruthy(); // Esperamos que la respuesta sea exitosa
    });

    it('/auth/create-sa (POST) should create a new Super Admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/create-sa')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          username: 'john.doe',
          email: 'john@example.com',
          password: 'superPassword123',
          roles: ['SUPER_ADMIN'],
          status: 'active',
        })
        .expect(201);

      expect(response.body).toEqual({
        statusCode: 201,
        message: 'SA created',
      });
    });
  });
});
