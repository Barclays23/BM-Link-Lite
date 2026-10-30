import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';





describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('checkHealth', () => {
    it('should return the API health status', () => {
      expect(appController.checkHealth()).toEqual({
        status: 'ok',
        message: 'URL Shortener API is running',
      });
    });
  });
  
});
