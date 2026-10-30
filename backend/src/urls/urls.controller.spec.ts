import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller.js';
import { UrlsService } from './urls.service.js';




describe('UrlsController', () => {
  let controller: UrlsController;

  const mockUrlsService = {
    createUrl: vi.fn(),
    getUserUrls: vi.fn(),
    getOriginalUrl: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: mockUrlsService,
        },
      ],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
