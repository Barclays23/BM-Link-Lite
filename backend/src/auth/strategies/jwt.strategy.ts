import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  email: string;
}




@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            // Read the token from Authorization: Bearer <token>.
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            // Reject expired tokens.
            ignoreExpiration: false,

            // Use the same secret that signs the token.
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    // Passport calls validate() after the token's signature and expiry
    // have been checked successfully.
    async validate(payload: JwtPayload) {
        // This object becomes request.user in the controller.
        return {
            userId: payload.sub,
            email: payload.email,
        };
    }
}