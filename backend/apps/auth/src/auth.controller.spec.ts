import { Response, Request } from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserDocument, UserRoles } from '@app/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CreateSADto, CreateUserDto, UsersService } from './users';

import { LoginDto } from './dto/login.dto'; // Asegúrate de que este DTO esté importado

import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    signup: jest.fn(),
    emailActivation: jest.fn(),
    createSA: jest.fn(),
    changePassword: jest.fn(),
    recoverAccount: jest.fn(),
    logout: jest.fn(),
  };

  const mockUserService = {
    getUserByEmail: jest.fn(),
    create: jest.fn(),
    createSA: jest.fn(),
    isSuperAdminPresent: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should call login and return the correct response', async () => {
      const user = {
        _id: 'someUserId',
        email: 'test@example.com',
        roles: ['USER'],
      } as unknown as UserDocument;

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = {
        cookie: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      const loginResponse = { statusCode: 200, message: 'User logged in' };

      // Mock the service login method to return a successful response
      mockAuthService.login.mockResolvedValue(loginResponse);

      await authController.login(loginDto, user, response);

      // Verificaciones
      expect(mockAuthService.login).toHaveBeenCalledWith(user, response);
      expect(response.send).toHaveBeenCalledWith({
        statusCode: 200,
        message: 'User logged in',
      });
    });

    it('should return 401 when user login fails', async () => {
      const user = {
        _id: 'someUserId',
        email: 'test@example.com',
        roles: ['USER'],
      } as unknown as UserDocument;

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = {
        cookie: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      // Mock the service login method to throw UnauthorizedException
      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      try {
        await authController.login(loginDto, user, response);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(response.send).not.toHaveBeenCalled();
      }
    });
  });

  describe('signup', () => {
    it('should create a new user and return a success response', async () => {
      const request = {
        user: {
          _id: 'adminUserId',
          email: 'admin@example.com',
          roles: [UserRoles.ADMINISTRATOR],
        },
      } as unknown as Request;

      const createUserDto: CreateUserDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        username: 'test1',
      };

      const signupResponse = { statusCode: 201, message: 'User created' };

      // Mock the service signup method
      mockAuthService.signup.mockResolvedValue(signupResponse);

      const result = await authController.signup(request, createUserDto);

      // Verificaciones
      expect(mockAuthService.signup).toHaveBeenCalledWith(
        request.user,
        createUserDto,
      );
      expect(result).toEqual(signupResponse);
    });

    it('should throw UnauthorizedException for non-admin user', async () => {
      const request = {
        user: {
          _id: 'userId',
          email: 'user@example.com',
          roles: ['USER'],
        },
      } as unknown as Request;

      const createUserDto: CreateUserDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        username: 'test1',
      };

      // Mock the service signup method to throw UnauthorizedException
      mockAuthService.signup.mockRejectedValue(new UnauthorizedException());

      await expect(
        authController.signup(request, createUserDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('createSA', () => {
    it('should create a super admin and return a success response', async () => {
      const createSADto: CreateSADto = {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'sa@example.com',
        password: 'admin123',
        roles: ['SA'],
        status: 'ACTIVE',
        username: 'test1',
      };

      const createSAResponse = { statusCode: 201, message: 'SA created' };

      // Mock the service createSA method
      mockUserService.isSuperAdminPresent.mockResolvedValue(false); // Simular que no existe un SA
      mockAuthService.createSA.mockResolvedValue(createSAResponse);

      const result = await authController.createSA(createSADto);

      // Verificaciones
      expect(mockAuthService.createSA).toHaveBeenCalledWith(createSADto);
      expect(result).toEqual(createSAResponse);
    });

    it('should throw BadRequestException if SA already exists', async () => {
      const createSADto: CreateSADto = {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'sa@example.com',
        password: 'admin123',
        roles: ['SA'],
        status: 'ACTIVE',
        username: 'test1',
      };

      // Simular que ya existe un SA
      mockUserService.isSuperAdminPresent.mockResolvedValue(true); // Simular que ya existe un SA

      // Mock the service createSA method to throw BadRequestException
      mockAuthService.createSA.mockRejectedValue(
        new BadRequestException(`Link is not available`),
      );

      // Asegúrate de que se lanza la excepción correcta
      await expect(authController.createSA(createSADto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
