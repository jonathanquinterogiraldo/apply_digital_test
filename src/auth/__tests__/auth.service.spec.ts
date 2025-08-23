import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn().mockResolvedValue({
              id: 1,
              username: 'test',
              password: 'hashedPassword',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
