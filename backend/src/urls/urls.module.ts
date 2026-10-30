import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller.js';
import { UrlsService } from './urls.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortUrl, ShortUrlSchema } from './schemas/url.schema.js';
import { AuthModule } from '../auth/auth.module.js';
import { RedirectController } from './redirect.controller.js';



@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: ShortUrl.name, 
        schema: ShortUrlSchema 
      },
    ]),

    AuthModule
  ],

  controllers: [
    UrlsController,
    RedirectController,
  ],

  providers: [UrlsService]
})

export class UrlsModule {}
