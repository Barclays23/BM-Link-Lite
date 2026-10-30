import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema.js';




describe('UsersService', () => {
  let service: UsersService;

  const mockUserModel = {
    create: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findById: vi.fn(),
    exec: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
