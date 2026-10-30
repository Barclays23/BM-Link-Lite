import {
  Controller,
  Get,
  Param,
  Redirect,
} from '@nestjs/common';

import { UrlsService } from './urls.service.js';





@Controller('r')
export class RedirectController {
    constructor(
        private readonly _urlsService: UrlsService,
    ) {}

    // GET /r/:code
    // This route is public. It does not use JwtAuthGuard.
    @Get(':code')
    @Redirect()
    async redirect(@Param('code') code: string) {
        const originalUrl: string = await this._urlsService.getOriginalUrl(code);

        // NestJS responds with an HTTP redirect (302 by default).
        return {
            url: originalUrl,
            statusCode: 302,
        };
    }
}