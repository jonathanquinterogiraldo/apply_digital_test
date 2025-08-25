import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };

    it('should return token when credentials are valid', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock<Promise<boolean>, [string, string]>).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('mockToken');

      const result = await authService.login('testuser', 'password');

      expect(usersService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
      expect(result).toEqual({ token: 'mockToken' });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValue(null);

      await expect(authService.login('unknown', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock<Promise<boolean>, [string, string]>).mockResolvedValue(false);

      await expect(authService.login('testuser', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
