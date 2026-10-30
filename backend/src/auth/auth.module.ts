import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module.js';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';




@Module({
  imports: [
    // Gives AuthService access to UsersService.
    UsersModule,

    // Registers Passport with JWT as the default strategy.
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.register({}),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
  ],

  exports: [
    JwtAuthGuard,
  ],
})
export class AuthModule {}

