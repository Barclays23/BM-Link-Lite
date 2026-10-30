import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service.js';



interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  tokenVersion: number;
  tokenUse: 'access' | 'refresh';
}




@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly _usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    // Passport calls validate() after the token's signature and expiry have been checked successfully.
    async validate(payload: JwtPayload) {
        if (payload.tokenUse !== 'access') {
            throw new UnauthorizedException(
                'Invalid access token',
            );
        }

        const user = await this._usersService.findAuthUserById(payload.sub);

        if (!user || user.tokenVersion !== payload.tokenVersion) {
            throw new UnauthorizedException('Session expired. Please log in again.');
        }

        // This object becomes request.user in the controller.
        return {
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    }
}