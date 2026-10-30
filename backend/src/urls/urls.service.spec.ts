import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service.js';
import { getModelToken } from '@nestjs/mongoose';
import { ShortUrl } from './schemas/url.schema.js';
import { ConfigService } from '@nestjs/config';




describe('UrlsService', () => {
  let service: UrlsService;

  const mockShortUrlModel = {
    create: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    exec: vi.fn(),
  };


  const mockConfigService = {
    getOrThrow: vi.fn((key: string): string => {
      if (key === 'SHORT_URL_BASE') return 'http://localhost:3000/r';
      return '';
    }),
    get: vi.fn(),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getModelToken(ShortUrl.name),
          useValue: mockShortUrlModel,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
