import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Request, Response as ExpressResponse, } from 'express';

import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '../utils/refreshCookie.utils.js';


// Type for requests that have passed the JWT guard.
interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        email: string;
        name: string;
    };
}





@Controller('auth')
export class AuthController {
    constructor(
        private readonly _authService: AuthService,
    ) {}

    // POST /api/auth/register
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this._authService.register(registerDto);
    }

    // POST /api/auth/login
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: ExpressResponse
    ) {
        const result = await this._authService.login(loginDto);

        setRefreshTokenCookie(res, result.refreshToken);

        return {
            message: result.message,
            accessToken: result.accessToken,
            user: result.user,
        };
    }


    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: ExpressResponse,
    ) {
        const refreshToken = req.cookies?.refreshToken;

        const result = await this._authService.refreshTheToken(
            refreshToken,
        );

        setRefreshTokenCookie(res, result.refreshToken);

        return {
            message: result.message,
            accessToken: result.accessToken,
            user: result.user,
        };
    }


    // GET /api/auth/me
    // Requires a valid JWT.
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getCurrentUser(@Req() request: AuthenticatedRequest) {
        return {
            user: request.user,
        };
    }

    // POST /api/auth/logout
    // Requires a valid JWT.
    @Post('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: ExpressResponse
    ) {
        await this._authService.logout(req.cookies?.refreshToken);

        clearRefreshTokenCookie(res);

        return {
            message: 'Logout successful',
        };
    }
}
