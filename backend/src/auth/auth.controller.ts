import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';


// Type for requests that have passed the JWT guard.
interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        email: string;
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
    async login(@Body() loginDto: LoginDto) {
        return this._authService.login(loginDto);
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
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout() {
        return this._authService.logout();
    }
}
