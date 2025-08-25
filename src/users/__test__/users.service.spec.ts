import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userRepoMock: any;

  beforeEach(async () => {
    userRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(User), useValue: userRepoMock }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash password, save user and return instance', async () => {
    const createUserDto = { username: 'testuser', email: 'test@email.com', password: 'plain123' };
    const hashedPassword = 'hashed123';
    const savedUser = { ...createUserDto, password: hashedPassword };

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    userRepoMock.create.mockReturnValue(savedUser);
    userRepoMock.save.mockResolvedValue(savedUser);

    const result = await service.createUser(createUserDto);

    expect(bcrypt.hash).toHaveBeenCalledWith('plain123', 10);
    expect(userRepoMock.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: hashedPassword,
    });
    expect(userRepoMock.save).toHaveBeenCalledWith(savedUser);

    expect(result).toMatchObject({
      username: 'testuser',
    });

    expect(result).toBeInstanceOf(User);
  });

  it('should find user by username', async () => {
    const mockUser = { username: 'testuser', password: 'hashed123' };
    userRepoMock.findOne.mockResolvedValue(mockUser);

    const result = await service.findByUsername('testuser');

    expect(userRepoMock.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    expect(result).toEqual(mockUser);
  });
});
