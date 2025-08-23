import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    // Mock simple del UsersService
    usersService = {
      createUser: jest.fn().mockResolvedValue({
        id: 1,
        username: 'jonathan',
        email: 'jonathan@example.com',
      }),
      findByUsername: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
