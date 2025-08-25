import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ token: 'mockToken' }),
          },
        },
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
              password: 'hashed',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login successfully', async () => {
    // Arrange
    const credentials = { username: 'username', password: 'password' };

    // Act
    const response = await controller.login(credentials);

    // Assert
    expect(response).toStrictEqual({ token: 'mockToken' });
  });
});
