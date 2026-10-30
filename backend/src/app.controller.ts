import { Controller, Get } from '@nestjs/common';



@Controller('api/health')
export class AppController {
  @Get()
  checkHealth() {
    return {
      status: 'ok',
      message: 'URL Shortener API is running',
    };
  }
}
