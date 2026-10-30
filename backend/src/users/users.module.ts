import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema.js';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],

  // HTTP routes belonging to this module.
  controllers: [UsersController],

  // Services and other providers managed by NestJS.
  providers: [UsersService],

  // Allow other modules, such as AuthModule, to use UsersService.
  exports: [UsersService, MongooseModule],
})

export class UsersModule {}
