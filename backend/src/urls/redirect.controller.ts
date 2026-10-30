import {
  Controller,
  Get,
  Param,
  Redirect,
} from '@nestjs/common';

import { UrlsService } from './urls.service.js';





@Controller() // No controller prefix.
export class RedirectController {
    constructor(
        private readonly urlsService: UrlsService,
    ) {}

    // GET /:code
    // This route is public. It does not use JwtAuthGuard.
    @Get(':code')
    @Redirect()
    async redirect(@Param('code') code: string) {
        // Look up the short code and get its original URL.
        const originalUrl: string = await this.urlsService.getOriginalUrl(code);

        // NestJS responds with an HTTP redirect (302 by default).
        return {
            url: originalUrl,
            statusCode: 302,
        };
    }
}