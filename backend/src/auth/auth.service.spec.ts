import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';




describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    updateRefreshToken: vi.fn(),
  };

  const mockJwtService = {
    signAsync: vi.fn(),
    verifyAsync: vi.fn(),
  };

  const mockConfigService = {
    getOrThrow: vi.fn(),
    get: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
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
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
