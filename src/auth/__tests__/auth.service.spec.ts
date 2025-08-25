import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity/user.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn() as jest.MockedFunction<UsersService['findByUsername']>,
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn() as jest.MockedFunction<JwtService['sign']>,
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('login', () => {
    it('should return token when credentials are valid', async () => {
      usersService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock<Promise<boolean>, [string, string]>).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('mockToken');

      const result = await authService.login('testuser', 'password');

      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
      expect(() =>
        jwtService.sign({
          username: mockUser.username,
          sub: mockUser.id,
        }),
      ).not.toThrow();
      expect(result).toEqual({ token: 'mockToken' });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      usersService.findByUsername.mockResolvedValue(null);

      await expect(authService.login('unknown', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      usersService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock<Promise<boolean>, [string, string]>).mockResolvedValue(false);

      await expect(authService.login('testuser', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
