import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';





@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly _userModel: Model<User>,
    ) {}

    async emailExists(email: string): Promise<boolean> {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await this._userModel
            .exists({ email: normalizedEmail })
            .exec();

        // Returns true if a matching document exists, otherwise false.
        return user !== null;
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        const normalizedEmail = email.trim().toLowerCase();

        return this._userModel
            .findOne({ email: normalizedEmail })
            .select('+password')
            .exec();
    }

    async findAuthUserById(userId: string): Promise<UserDocument | null> {
        return this._userModel
            .findById(userId)
            .select('name email tokenVersion')
            .exec();
    }


    async createUser(
        createUserDto: CreateUserDto,
    ): Promise<{
        id: string;
        name: string;
        email: string;
    }> {
        const email = createUserDto.email.trim().toLowerCase();

        const emailExists = await this.emailExists(email);
        if (emailExists) {
            throw new ConflictException(
                'A user with this email already exists',
            );
        }

        const passwordHash = await bcrypt.hash(createUserDto.password, 12);

        const newUser = new this._userModel({
            name: createUserDto.name.trim(),
            email,
            password: passwordHash,
        });

        const savedUser = await newUser.save();

        return {
            id: savedUser._id.toString(),
            name: savedUser.name,
            email: savedUser.email
        };
    }


    async rotateTokenVersion(userId: string, expectedVersion: number): Promise<number | null> {
        const user = await this._userModel.findOneAndUpdate(
            {
                _id: userId,
                tokenVersion: expectedVersion,
            },
            {
                $inc: { tokenVersion: 1 },
            },
            {
                returnDocument: 'after',
            },
        ).exec();

        return user ? user.tokenVersion : null;
    }
}