import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module.js';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  // Apply /api to all routes except public short URL redirects.
  app.setGlobalPrefix('api', {
    exclude: [
      { 
        path: ':code',
        method: RequestMethod.GET 
      },
      {
        path: 'api/health',
        method: RequestMethod.GET,
      },
    ],
  });

  app.enableCors({
    origin: config.getOrThrow<string>('FRONTEND_URL'),
    credentials: true,
  });

  // Validate DTOs before controller methods receive the data.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = config.getOrThrow<number>('PORT');

  await app.listen(port);
}


await bootstrap();