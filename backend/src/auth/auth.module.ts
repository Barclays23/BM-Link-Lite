import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

    // Configures JWT signing and verification.
    // The secret comes from .env through ConfigService.
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
  ],

  // Other modules, such as UrlsModule, can reuse this guard.
  exports: [
    JwtAuthGuard,
  ],
})
export class AuthModule {}

