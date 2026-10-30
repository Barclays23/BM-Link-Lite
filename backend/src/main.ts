import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  // Render runs behind a reverse proxy.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.use(cookieParser());

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
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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