
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';




@Controller('users')
export class UsersController {
    // NestJS injects UsersService automatically.
    constructor(
        private readonly _usersService: UsersService,
    ) {}

    // POST /api/users
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this._usersService.createUser(createUserDto);
    }

    // GET /api/users/check-email?email=test@example.com
    // Development-only endpoint to understand database queries.
    @Get('check-email')
    async checkEmail(@Query('email') email: string) {
        const exists = await this._usersService.emailExists(email);

        return {
            email,
            exists,
        };
    }
}