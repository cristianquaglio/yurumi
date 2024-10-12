import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { UsersService } from './users';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let notificationsService: ClientProxy;

  const mockUsersService = {
    isSuperAdminPresent: jest.fn(),
    createSA: jest.fn(),
    create: jest.fn(),
    activateEmail: jest.fn(),
    getUser: jest.fn(),
    updateCurrentUser: jest.fn(),
    getUserByEmail: jest.fn(),
    changePassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockNotificationsService = {
    emit: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: 'notifications',
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    notificationsService = module.get<ClientProxy>('notifications');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSA', () => {
    it('should throw BadRequestException if Super Admin exists', async () => {
      mockUsersService.isSuperAdminPresent.mockResolvedValue(true);
      await expect(
        authService.createSA({
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123',
          roles: [],
          status: 'active',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a new Super Admin', async () => {
      mockUsersService.isSuperAdminPresent.mockResolvedValue(false);
      mockUsersService.createSA.mockResolvedValue({});
      const result = await authService.createSA({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        roles: [],
        status: 'active',
      });
      expect(result).toEqual({ statusCode: 201, message: 'SA created' });
    });
  });

  describe('signup', () => {
    it('should create a new user as an administrator', async () => {
      const user = { roles: ['SA'], dependence: 'someDependence' };
      const createUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        username: 'jane.doe',
        password: 'password123',
      };
      mockUsersService.create.mockResolvedValue({
        ...createUserDto,
        roles: ['ADMINISTRATOR'],
        password: 'password123',
      });
      mockJwtService.sign.mockReturnValue('token');
      mockConfigService.get.mockReturnValue('http://localhost:3000');

      const result = await authService.signup(user as any, createUserDto);

      expect(result).toEqual({ message: 'User created', statusCode: 201 });
      expect(notificationsService.emit).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user is not authorized', async () => {
      const user = { roles: [] };
      const createUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        username: 'jane.doe',
        password: 'password123',
      };

      await expect(
        authService.signup(user as any, createUserDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('emailActivation', () => {
    it('should activate the user email successfully', async () => {
      const emailActivationPayload = { token: 'someToken' };
      mockJwtService.verify.mockResolvedValue({ email: 'jane@example.com' });
      mockUsersService.activateEmail.mockResolvedValue({ firstName: 'Jane' });

      const result = await authService.emailActivation(emailActivationPayload);

      expect(result).toEqual({
        statusCode: 200,
        message: 'User email confirmated',
      });
      expect(notificationsService.emit).toHaveBeenCalled();
    });

    it('should throw BadRequestException for broken or expired token', async () => {
      const emailActivationPayload = { token: 'invalidToken' };
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('TokenExpiredError');
      });

      await expect(
        authService.emailActivation(emailActivationPayload),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should refresh tokens successfully', async () => {
      const user = {
        _id: { toHexString: jest.fn().mockReturnValue('userId') },
      };
      const response = { cookie: jest.fn() };
      mockUsersService.getUser.mockResolvedValue(user);
      mockJwtService.sign
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      const result = await authService.login(user as any, response as any);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Refresh token done',
      });
      expect(response.cookie).toHaveBeenCalledTimes(2);
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      const changePasswordDto = {
        password: 'oldPassword',
        newPassword: 'newPassword',
      };
      const userId = 'userId';
      mockUsersService.changePassword.mockResolvedValue(true);

      const result = await authService.changePassword(
        userId,
        changePasswordDto,
      );

      expect(result).toBeTruthy();
      expect(mockUsersService.changePassword).toHaveBeenCalledWith(
        userId,
        changePasswordDto,
      );
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      const user = {
        _id: { toHexString: jest.fn().mockReturnValue('userId') },
      };
      const response = { cookie: jest.fn() };
      mockUsersService.getUser.mockResolvedValue(user);
      mockJwtService.sign
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');
      mockUsersService.updateCurrentUser.mockResolvedValue({});

      const result = await authService.refreshTokens(
        user._id.toString(),
        response as any,
      );

      expect(result).toEqual({
        statusCode: 200,
        message: 'Refresh token done',
      });
      expect(response.cookie).toHaveBeenCalledTimes(2);
    });
  });

  describe('recoverAccount', () => {
    it('should recover the account and send email', async () => {
      const recoverAccountDto = { email: 'jane@example.com' };
      const user = { _id: 'userId', firstName: 'Jane', status: 'ACTIVE' };
      const generatedPassword = 'newPassword123';

      mockUsersService.getUserByEmail.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValueOnce(generatedPassword);
      mockUsersService.updateCurrentUser.mockResolvedValue({});
      mockNotificationsService.emit.mockResolvedValue({});

      const result = await authService.recoverAccount(recoverAccountDto);

      expect(result).toEqual({
        statusCode: 200,
        message: `A email was sended to you with the new credentials`,
      });
      expect(mockNotificationsService.emit).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user is not active', async () => {
      const recoverAccountDto = { email: 'jane@example.com' };
      const user = { _id: 'userId', firstName: 'Jane', status: 'INACTIVE' };

      mockUsersService.getUserByEmail.mockResolvedValue(user);

      await expect(
        authService.recoverAccount(recoverAccountDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const userId = 'userId';
      mockUsersService.updateCurrentUser.mockResolvedValue({});

      const result = await authService.logout(userId);

      expect(result).toBeTruthy();
      expect(mockUsersService.updateCurrentUser).toHaveBeenCalledWith(userId, {
        refreshToken: null,
      });
    });
  });

  describe('private methods', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should generate access token', () => {
      const payload = { userId: 'userId' };
      mockJwtService.sign.mockReturnValue('accessToken');

      const result = (authService as any).generateAccessToken(payload);

      expect(result).toBe('accessToken');
    });

    it('should generate refresh token', () => {
      const payload = { userId: 'userId' };
      mockJwtService.sign.mockReturnValue('refreshToken');

      const result = (authService as any).generateRefreshToken(payload);

      expect(result).toBe('refreshToken');
    });
  });
});
