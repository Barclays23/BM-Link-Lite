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
        // NestJS injects the registered Mongoose User model here.
        @InjectModel(User.name)
        private readonly _userModel: Model<User>,
    ) {}

    // Check whether a user already exists with this email.
    async emailExists(email: string): Promise<boolean> {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await this._userModel
            .exists({ email: normalizedEmail })
            .exec();

        // Returns true if a matching document exists, otherwise false.
        return user !== null;
    }

    // Find a user by email.
    // The Auth module can use this later during login.
    async findByEmail(email: string): Promise<UserDocument | null> {
        const normalizedEmail = email.trim().toLowerCase();

        return this._userModel
            .findOne({ email: normalizedEmail })
            .select('+password') // Explicitly include the password hash.
            .exec();
    }

    // Create a new user and save it in MongoDB.
    async createUser(
        createUserDto: CreateUserDto,
    ): Promise<{
        id: string;
        name: string;
        email: string;
    }> {
        const email = createUserDto.email.trim().toLowerCase();

        // Step 1: Check for an existing email.
        const emailExists = await this.emailExists(email);
        if (emailExists) {
            throw new ConflictException(
                'A user with this email already exists',
            );
        }

        // Step 2: Never save the original password.
        const passwordHash = await bcrypt.hash(createUserDto.password, 12);

        // Step 3: Create a Mongoose document.
        const newUser = new this._userModel({
            name: createUserDto.name.trim(),
            email,
            password: passwordHash,
        });

        // Step 4: Save the document to MongoDB.
        const savedUser = await newUser.save();

        // Step 5: Return safe user data, not the password hash.
        return {
            id: savedUser._id.toString(),
            name: savedUser.name,
            email: savedUser.email
        };
    }
}