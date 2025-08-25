import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create.user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call UsersService.createUser and return the result', async () => {
    const dto: CreateUserDto = {
      username: 'testuser',
      password: 'testpass',
      email: 'test@example.com',
    };
    const mockResult = { id: '1', ...dto };

    (usersService.createUser as jest.Mock).mockResolvedValue(mockResult);

    const result = await controller.register(dto);

    (usersService.createUser as unknown as jest.Mock).mockResolvedValue(mockResult);
    expect(result).toEqual(mockResult);
  });
});
