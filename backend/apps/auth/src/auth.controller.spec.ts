import { Response, Request } from 'express';
import {
  BadRequestException,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { JwtAuthGuard, UserDocument, UserRoles } from '@app/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  ChangePasswordDto,
  CreateSADto,
  CreateUserDto,
  IEmailActivationPayload,
  UsersService,
} from './users';
import { LoginDto } from './dto/login.dto';
import { RecoverAccountDto } from './dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockAuthService = {
    changePassword: jest.fn(),
    createSA: jest.fn(),
    emailActivation: jest.fn(),
    getTokens: jest.fn(),
    getUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    recoverAccount: jest.fn(),
    refreshTokens: jest.fn(),
    signup: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
    createSA: jest.fn(),
    getUser: jest.fn(),
    getUserByEmail: jest.fn(),
    isSuperAdminPresent: jest.fn(),
    updateCurrentUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
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
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('createSA', () => {
    it('should create a super admin and return a success response', async () => {
      // arrange
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
      mockUserService.isSuperAdminPresent.mockResolvedValue(false);
      mockAuthService.createSA.mockResolvedValue(createSAResponse);

      // act
      const result = await authController.createSA(createSADto);

      // assert
      expect(mockAuthService.createSA).toHaveBeenCalledWith(createSADto);
      expect(result).toEqual(createSAResponse);
    });

    it('should throw BadRequestException if SA already exists', async () => {
      // arrange
      const createSADto: CreateSADto = {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'sa@example.com',
        password: 'admin123',
        roles: ['SA'],
        status: 'ACTIVE',
        username: 'test1',
      };
      mockUserService.isSuperAdminPresent.mockResolvedValue(true);
      mockAuthService.createSA.mockRejectedValue(
        new BadRequestException(`Link is not available`),
      );

      // act & assert
      await expect(authController.createSA(createSADto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signup', () => {
    // arrange
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
      mockAuthService.signup.mockResolvedValue(signupResponse);

      // act
      const result = await authController.signup(request, createUserDto);

      // assert
      expect(mockAuthService.signup).toHaveBeenCalledWith(
        request.user,
        createUserDto,
      );
      expect(result).toEqual(signupResponse);
    });

    it('should throw UnauthorizedException for non-admin user', async () => {
      // arrange
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
      mockAuthService.signup.mockRejectedValue(new UnauthorizedException());

      // act & assert
      await expect(
        authController.signup(request, createUserDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should call login and return the correct response', async () => {
      // arrange
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
      mockAuthService.login.mockResolvedValue(loginResponse);

      // act
      await authController.login(loginDto, user, response);

      // assert
      expect(mockAuthService.login).toHaveBeenCalledWith(user, response);
      expect(response.send).toHaveBeenCalledWith({
        statusCode: 200,
        message: 'User logged in',
      });
    });

    it('should return 401 when user login fails', async () => {
      // arrange
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
      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      // act & assert
      try {
        await authController.login(loginDto, user, response);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(response.send).not.toHaveBeenCalled();
      }
    });
  });

  describe('getUser', () => {
    let user: UserDocument;
    beforeEach(() => {
      user = {
        firstName: 'Cristian',
        lastName: 'Quagliozzi',
        email: 'cristianquaglio@gmail.com',
        dependence: '66d1d6d78cfc99e93c2f5f84',
        roles: ['SA'],
      } as UserDocument;
    });

    it('should return the current user', () => {
      // arrange
      mockAuthService.getUser.mockResolvedValue(user);
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user,
          }),
        }),
      } as unknown as ExecutionContext;
      jest
        .spyOn(JwtAuthGuard.prototype, 'canActivate')
        .mockImplementation(() => true);

      // act
      const result = authController.getUser(
        mockContext.switchToHttp().getRequest().user,
      );

      // assert
      expect(result).toEqual({
        firstName: 'Cristian',
        lastName: 'Quagliozzi',
        email: 'cristianquaglio@gmail.com',
        dependence: '66d1d6d78cfc99e93c2f5f84',
        roles: ['SA'],
      });
    });

    it('should throw UnauthorizedException if user is not present', () => {
      // arrange
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: null,
          }),
        }),
      } as unknown as ExecutionContext;

      // act & assert
      expect(() => {
        authController.getUser(mockContext.switchToHttp().getRequest().user);
      }).toThrow(UnauthorizedException);
    });
  });

  describe('emailActivation', () => {
    it('should return confirmation when email is activated successfully', async () => {
      // arrange
      const emailActivationPayload: IEmailActivationPayload = {
        token: 'valid_token',
      };
      const expectedResult = {
        statusCode: 200,
        message: 'User email confirmated',
      };
      jest
        .spyOn(authService, 'emailActivation')
        .mockResolvedValue(expectedResult);

      // act
      const result = await authController.emailActivation(
        emailActivationPayload,
      );

      // assert
      expect(result).toEqual(expectedResult);
      expect(authService.emailActivation).toHaveBeenCalledWith(
        emailActivationPayload,
      );
    });

    it('should throw BadRequestException when token is broken or expired', async () => {
      // arrange
      const emailActivationPayload: IEmailActivationPayload = {
        token: 'invalid_token',
      };
      jest
        .spyOn(authService, 'emailActivation')
        .mockRejectedValue(
          new BadRequestException('Email confirmation token broken or expired'),
        );

      // act & assert
      await expect(
        authController.emailActivation(emailActivationPayload),
      ).rejects.toThrow(BadRequestException);
      expect(authService.emailActivation).toHaveBeenCalledWith(
        emailActivationPayload,
      );
    });
  });

  describe('changePassword', () => {
    it('should successfully change password', async () => {
      // arrange
      const changePasswordDto: ChangePasswordDto = {
        password: 'NewStrongPass123!',
      };
      const req = { user: { _id: 'user123' } } as any;
      const expectedResponse = {
        statusCode: 200,
        message: 'Password changed successfully',
      };
      jest
        .spyOn(authService, 'changePassword')
        .mockResolvedValue(expectedResponse);

      // act
      const result = await authController.changePassword(
        changePasswordDto,
        req,
      );

      // assert
      expect(authService.changePassword).toHaveBeenCalledWith(
        'user123',
        changePasswordDto,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should throw UnauthorizedException if user is not active', async () => {
      // arrange
      const changePasswordDto: ChangePasswordDto = {
        password: 'NewStrongPass123!',
      };
      const req = { user: { _id: 'user123' } } as any;
      jest
        .spyOn(authService, 'changePassword')
        .mockRejectedValue(new UnauthorizedException());

      // act & assert
      await expect(
        authController.changePassword(changePasswordDto, req),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if password is the same', async () => {
      // arrange
      const changePasswordDto: ChangePasswordDto = { password: 'OldPass123' };
      const req = { user: { _id: 'user123' } } as any;
      jest
        .spyOn(authService, 'changePassword')
        .mockRejectedValue(
          new BadRequestException("Password can't be the same one"),
        );

      // act & assert
      await expect(
        authController.changePassword(changePasswordDto, req),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshTokens', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    beforeEach(() => {
      mockRequest = {
        user: {
          _id: 'user-id-123',
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
      };
    });

    it('should refresh tokens and return status 200', async () => {
      // arrange
      const mockTokensResult = {
        statusCode: 200,
        message: 'Refresh token done',
      };
      jest
        .spyOn(authService, 'refreshTokens')
        .mockResolvedValue(mockTokensResult);

      // act
      await authController.refreshTokens(
        mockRequest as Request,
        mockResponse as Response,
      );

      // assert
      expect(authService.refreshTokens).toHaveBeenCalledWith(
        mockRequest.user['_id'],
        mockResponse,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTokensResult);
    });

    it('should throw UnauthorizedException if no refresh token is provided', async () => {
      // arrange
      const req = { user: { _id: 'user123' } } as any;
      const res = { cookie: jest.fn() } as unknown as Response;
      jest
        .spyOn(authService, 'refreshTokens')
        .mockRejectedValue(
          new UnauthorizedException('No refresh token provided'),
        );

      // act & assert
      await expect(authController.refreshTokens(req, res)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if the refresh token is invalid', async () => {
      // arrange
      const req = { user: { _id: 'user123' } } as any;
      const res = { cookie: jest.fn() } as any;
      jest
        .spyOn(authService, 'refreshTokens')
        .mockRejectedValue(new UnauthorizedException('Invalid refresh token'));

      // act & assert
      await expect(authController.refreshTokens(req, res)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('recoverAccount', () => {
    const recoverAccountDto: RecoverAccountDto = {
      email: 'test@example.com',
    };

    it('should return success message when account is recovered', async () => {
      // arrange
      const result = {
        statusCode: 200,
        message: 'A email was sended to you with the new credentials',
      };
      mockAuthService.recoverAccount.mockResolvedValue(result);

      // act & assert
      expect(await authController.recoverAccount(recoverAccountDto)).toEqual(
        result,
      );
      expect(mockAuthService.recoverAccount).toHaveBeenCalledWith(
        recoverAccountDto,
      );
    });

    it('should throw UnauthorizedException if user is not active', async () => {
      // arrange
      mockAuthService.recoverAccount.mockRejectedValue(
        new UnauthorizedException('User is not active'),
      );

      // act & assert
      await expect(
        authController.recoverAccount(recoverAccountDto),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.recoverAccount).toHaveBeenCalledWith(
        recoverAccountDto,
      );
    });

    it('should throw NotFoundException if document is not found', async () => {
      // arrange
      mockAuthService.recoverAccount.mockRejectedValue({
        status: 404,
        message: 'Document was not found',
      });

      // act & assert
      await expect(
        authController.recoverAccount(recoverAccountDto),
      ).rejects.toEqual({
        status: 404,
        message: 'Document was not found',
      });
    });
  });

  describe('logout', () => {
    let req: Request;
    let res: Response;

    beforeEach(() => {
      res = {
        clearCookie: jest.fn(),
        sendStatus: jest.fn(),
      } as unknown as Response;

      req = {
        user: { _id: 'someUserId' },
      } as unknown as Request;
    });

    it('should call authService.logout and return status 200', async () => {
      // arrange
      mockAuthService.logout.mockResolvedValue({
        statusCode: 200,
        message: 'User logged out',
      });

      // act
      await authController.logout(req, res);

      // act & assert
      expect(mockAuthService.logout).toHaveBeenCalledWith(req.user['_id']);
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('should handle errors in logout process', async () => {
      // arrange
      mockAuthService.logout.mockRejectedValue(new Error('Logout failed'));

      // act & assert
      await expect(authController.logout(req, res)).rejects.toThrow(
        'Logout failed',
      );
    });
  });
});
