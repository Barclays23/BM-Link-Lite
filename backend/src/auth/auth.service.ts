import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';





@Injectable()
export class AuthService {
    constructor(
        private readonly _usersService: UsersService,
        private readonly _jwtService: JwtService,
    ) {}

    // Register a user and issue an access token.
    async register(registerDto: RegisterDto) {
        const user = await this._usersService.createUser({
            name: registerDto.name,
            email: registerDto.email,
            password: registerDto.password,
        });

        // "sub" is the standard JWT claim for the subject/user ID.
        const payload = {
            sub: user.id,
            email: user.email,
        };

        const accessToken = await this._jwtService.signAsync(payload);

        // Never return the password or password hash.
        return {
            message: 'Registration successful',
            accessToken,
            tokenType: 'Bearer',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    // Verify credentials and issue a token.
    async login(loginDto: LoginDto) {
        // findByEmail() explicitly includes passwordHash in its query.
        const user = await this._usersService.findByEmail(loginDto.email);

        // Use the same generic error for an unknown email
        // and an incorrect password.
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Compare the entered password with the stored bcrypt hash.
        const passwordMatches = await bcrypt.compare(loginDto.password, user.password);

        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            sub: user._id.toString(),
            email: user.email,
        };

        const accessToken = await this._jwtService.signAsync(payload);

        return {
            message: 'Login successful',
            accessToken,
            tokenType: 'Bearer',
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        };
    }

    // Return a simple response for a logout request.
    // This does NOT invalidate a stateless JWT on the server.
    logout() {
        return {
            message: 'Logout successful. Please clear your access token.',
        };
    }
}