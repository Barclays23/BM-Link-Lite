
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';


export type UrlDocument = HydratedDocument<ShortUrl>;


@Schema({ timestamps: true })
export class ShortUrl {
    @Prop({
        required: true,
        trim: true,
    })
    originalUrl: string;

    @Prop({
        required: true,
        unique: true,
        trim: true,
        index: true,
    })
    shortCode: string;

    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true,
        index: true,
    })
    userId: Types.ObjectId;

    @Prop({
        default: 0,
        min: 0,
    })
    clickCount!: number;

    createdAt!: Date;
    updatedAt!: Date;
}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);
