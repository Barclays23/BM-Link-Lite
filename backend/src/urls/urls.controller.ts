import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { UrlsService } from './urls.service.js';
import { CreateUrlDto } from './dto/create-url.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { GetUrlsQueryDto } from './dto/get-urls.dto.js';



interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}




@Controller('urls')
@UseGuards(JwtAuthGuard)
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
        @Query() query: GetUrlsQueryDto,
    ) {
        return this._urlsService.getUserUrls(
            request.user.userId,
            query,
        );
    }


    // DELETE /api/urls/:id
    @Delete(':id')
    async deleteUrl(
        @Param('id') urlId: string,
        @Req() request: AuthenticatedRequest,
    ) {
        return this._urlsService.deleteUrl(
            urlId,
            request.user.userId,
        );
    }


}