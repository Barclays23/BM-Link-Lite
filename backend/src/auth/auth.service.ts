import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ConfigService } from '@nestjs/config';



interface TokenPayload {
  sub: string; // "sub" is the standard JWT claim for the subject/user ID.
  email: string;
  name: string;
  tokenVersion: number;
  tokenUse: 'access' | 'refresh';
}



@Injectable()
export class AuthService {
    constructor(
        private readonly _usersService: UsersService,
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService,
    ) {}


    async register(registerDto: RegisterDto) {
        const user = await this._usersService.createUser({
            name: registerDto.name,
            email: registerDto.email,
            password: registerDto.password,
        });

        return {
            message: 'Registration successful',
            user: {
                userId: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }


    async login(loginDto: LoginDto) {
        const user = await this._usersService.findByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const passwordMatches = await bcrypt.compare(loginDto.password, user.password);

        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const {accessToken, refreshToken} = await this.generateTokens({
            sub: user._id.toString(), // "sub" is the standard JWT claim for the subject/user ID.
            email: user.email,
            name: user.name,
            tokenVersion: user.tokenVersion ?? 0,
        });

        return {
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        };
    }



    async refreshTheToken(incomingRefreshToken: string) {
        if (!incomingRefreshToken) {
            throw new UnauthorizedException(
                'Refresh token is missing',
            );
        }

        let payload: TokenPayload;

        try {
            payload = await this._jwtService.verifyAsync<TokenPayload>(
                incomingRefreshToken,
                {
                    secret: this._configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
                },
            );
            
        } catch {
            throw new UnauthorizedException(
                'Invalid or expired refresh token',
            );
        }

        if (payload.tokenUse !== 'refresh') {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }

        const newVersion = await this._usersService.rotateTokenVersion(
            payload.sub,
            payload.tokenVersion,
        );

        if (newVersion === null) {
            throw new UnauthorizedException(
                'Refresh token has already been used or revoked',
            );
        }

        const user = await this._usersService.findAuthUserById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const {accessToken, refreshToken: newRefreshToken,} = await this.generateTokens({
            sub: user._id.toString(),
            email: user.email,
            name: user.name,
            tokenVersion: newVersion,
        });

        return {
            message: 'Token refreshed successfully',
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                userId: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        };
    }



    async logout(refreshToken?: string): Promise<void> {
        if (!refreshToken) {
            return;
        }

        try {
            const payload = await this._jwtService.verifyAsync<TokenPayload>(
                refreshToken,
                {
                    secret: this._configService.getOrThrow<string>(
                    'JWT_REFRESH_SECRET',
                    ),
                },
            );

            if (payload.tokenUse !== 'refresh') {
                return;
            }

            await this._usersService.rotateTokenVersion(
                payload.sub,
                payload.tokenVersion,
            );

        } catch {
        // An invalid or expired refresh token cannot be reused.
        }
    }



    private async generateTokens(payload: {
        sub: string;
        email: string;
        name: string;
        tokenVersion: number;
    }) {
        const accessPayload: TokenPayload = {
            ...payload,
            tokenUse: 'access',
        };

        const refreshPayload: TokenPayload = {
            ...payload,
            tokenUse: 'refresh',
        };

        const accessSecret = this._configService.getOrThrow<string>('JWT_SECRET');

        const refreshSecret = this._configService.getOrThrow<string>('JWT_REFRESH_SECRET');

        const accessExpiresIn = this._configService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN');

        const refreshExpiresIn = this._configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN');

        const accessOptions: JwtSignOptions = {
            secret: accessSecret,
            expiresIn: accessExpiresIn as JwtSignOptions['expiresIn'],
        };

        const refreshOptions: JwtSignOptions = {
            secret: refreshSecret,
            expiresIn: refreshExpiresIn as JwtSignOptions['expiresIn'],
        };

        const [accessToken, refreshToken] = await Promise.all([
            this._jwtService.signAsync(accessPayload, accessOptions),
            this._jwtService.signAsync(refreshPayload, refreshOptions),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}