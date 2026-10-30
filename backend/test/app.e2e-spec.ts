import { Test, type TestingModule } from '@nestjs/testing';
import { RequestMethod, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { describe, beforeAll, afterAll, it } from 'vitest';
import { AppModule } from '../src/app.module.js';




describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api', {
      exclude: [
        { path: 'api/health', method: RequestMethod.GET },
        { path: 'r/:code', method: RequestMethod.GET },
      ],
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health (GET)', () => {
    const server = app.getHttpServer() as App;

    return request(server)
      .get('/api/health')
      .expect(200);
  });
});