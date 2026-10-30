import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { UrlsService } from './urls.service.js';
import { CreateUrlDto } from './dto/create-url.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';



// Shape of request.user populated by JwtStrategy.validate().
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}




@Controller('urls')
@UseGuards(JwtAuthGuard) // Protect every endpoint in this controller.
export class UrlsController {
    constructor(
        private readonly _urlsService: UrlsService,
    ) {}

    // POST /api/urls
    @Post()
    async createUrl(
        @Body() createUrlDto: CreateUrlDto,
        @Req() request: AuthenticatedRequest,
    ) {
        return this._urlsService.createUrl(
            createUrlDto,
            request.user.userId,
        );
    }

    // GET /api/urls
    @Get()
    async getUserUrls(
        @Req() request: AuthenticatedRequest,
    ) {
        return this._urlsService.getUserUrls(
            request.user.userId,
        );
    }
}