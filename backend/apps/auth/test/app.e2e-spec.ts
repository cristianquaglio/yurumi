import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
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
    it('should log in and create a new user', async () => {
      try {
        const loginResponse = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'cristianquaglio@gmail.com', password: 'Admin123*1' });
    
        console.log('Login Response Headers:', loginResponse.headers);
    
        expect(loginResponse.status).toBe(200);
    
        const cookies: string[] = loginResponse.headers['set-cookie'] as unknown as string[];
    
        if (cookies && cookies.length > 0) {
          const authCookie = cookies.find((cookie) =>
            cookie.startsWith('Authentication='),
          );
    
          if (authCookie) {
            const cookieValue = authCookie.split(';')[0];
            console.log('Cookie Value for Signup:', cookieValue);
    
            // Espera 100 ms antes de la siguiente solicitud
            await new Promise(resolve => setTimeout(resolve, 100));
    
            const signupResponse = await request(app.getHttpServer())
              .post('/auth/signup')
              .set('Cookie', cookieValue)
              .send({
                firstName: 'Noelia',
                lastName: 'Gallo',
                username: 'noegallo',
                email: 'noeliagallo@yahoo.com.ar',
                dependence: '66e1f0b0a148fc3fe843a5db',
              });
    
            console.log('Signup Response:', signupResponse.body);
    
            expect(signupResponse.status).toBe(201);
            expect(signupResponse.body).toEqual({
              message: 'User created',
              statusCode: 201,
            });
          } else {
            console.error('There is no Authentication cookie');
          }
        } else {
          console.error('There are no cookies');
        }
      } catch (error) {
        console.error('Error during login/signup:', error);
        throw error; // Re-lanzar el error para que Jest lo reconozca
      }
    });
    

    // it('/auth/activate-email (POST) should activate user email', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/auth/activate-email')
    //     .send({
    //       token: 'validToken', // Usa un token válido aquí
    //     })
    //     .expect(200);

    //   expect(response.body).toEqual({
    //     statusCode: 200,
    //     message: 'User email confirmated',
    //   });
    // });

    // it('/auth/refresh-tokens (POST) should refresh tokens successfully', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/auth/refresh-tokens')
    //     .send({
    //       userId: 'userId', // Usa un ID de usuario válido
    //     })
    //     .expect(200);

    //   expect(response.body).toEqual({
    //     statusCode: 200,
    //     message: 'Refresh token done',
    //   });
    //   expect(response.body).toHaveProperty('accessToken');
    //   expect(response.body).toHaveProperty('refreshToken');
    // });

    // it('/auth/recover-account (POST) should recover the account and send email', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/auth/recover-account')
    //     .send({
    //       email: 'jane@example.com',
    //     })
    //     .expect(200);

    //   expect(response.body).toEqual({
    //     statusCode: 200,
    //     message: `A email was sended to you with the new credentials`,
    //   });
    // });

    // it('/auth/logout (POST) should log out the user', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/auth/logout')
    //     .send({
    //       userId: 'userId', // Usa un ID de usuario válido
    //     })
    //     .expect(200);

    //   expect(response.body).toBeTruthy();
    // });

    // it('/auth/change-password (POST) should change user password', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/auth/change-password')
    //     .send({
    //       userId: 'userId', // Usa un ID de usuario válido
    //       password: 'oldPassword',
    //       newPassword: 'newPassword123',
    //     })
    //     .expect(200);

    //   expect(response.body).toBeTruthy(); // Esperamos que la respuesta sea exitosa
    // });

    // it('/auth/create-sa (POST) should create a new Super Admin', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/auth/create-sa')
    //     .send({
    //       firstName: 'John',
    //       lastName: 'Doe',
    //       username: 'john.doe',
    //       email: 'john@example.com',
    //       password: 'superPassword123',
    //       roles: ['SUPER_ADMIN'],
    //       status: 'active',
    //     })
    //     .expect(201);

    //   expect(response.body).toEqual({
    //     statusCode: 201,
    //     message: 'SA created',
    //   });
    // });
  });
});
