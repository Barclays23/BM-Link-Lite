import {
    Injectable,
    NotFoundException,
    ServiceUnavailableException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'node:crypto';

import { ShortUrl } from './schemas/url.schema.js';
import { CreateUrlDto } from './dto/create-url.dto.js';
import { ConfigService } from '@nestjs/config';





@Injectable()
export class UrlsService {
    constructor(
        // Inject the Mongoose URL model registered in UrlsModule.
        @InjectModel(ShortUrl.name)
        private readonly urlModel: Model<ShortUrl>,

        // Used to construct the complete short URL.
        private readonly _configService: ConfigService,
    ) {}

    // Generate a URL-safe random code.
    private generateShortCode(): string {
        return randomBytes(6).toString('base64url');
    }

    // Create a shortened URL for the authenticated user.
    async createUrl(createUrlDto: CreateUrlDto, userId: string) {
        // The user ID comes from the verified JWT, not the request body.
        const ownerId = new Types.ObjectId(userId);

        // Retry if an exceptionally rare code collision occurs.
        for (let attempt = 0; attempt < 5; attempt++) {
            const shortCode = this.generateShortCode();

            try {
                const savedUrl = await this.urlModel.create({
                    originalUrl: createUrlDto.originalUrl,
                    shortCode,
                    userId: ownerId,
                    clickCount: 0,
                });

                // Keep this setting aligned with the public redirect route.
                const baseUrl = this._configService
                    .getOrThrow<string>('SHORT_URL_BASE')
                    .replace(/\/+$/, '');

                return {
                    id: savedUrl._id.toString(),
                    originalUrl: savedUrl.originalUrl,
                    shortCode: savedUrl.shortCode,
                    shortUrl: `${baseUrl}/${savedUrl.shortCode}`,
                    clickCount: savedUrl.clickCount,
                    createdAt: savedUrl.createdAt,
                };

            } catch (error: unknown) {
                // MongoDB error code 11000 means a unique index conflict.
                const duplicateKey =
                    typeof error === 'object' &&
                    error !== null &&
                    'code' in error &&
                    error.code === 11000;

                if (duplicateKey) {
                    // Retry if the short code collided with an existing code.
                    continue;
                }

                // Let unexpected database errors propagate normally.
                throw error;
            }
        }

        // Very unlikely, but don't loop indefinitely.
        throw new ServiceUnavailableException(
            'Could not generate a unique short code. Please try again.',
        );
    }

    // Return only the URLs belonging to this user.
    async getUserUrls(userId: string) {
        const urls = await this.urlModel
            .find({ userId: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();

        const baseUrl = this._configService
            .getOrThrow<string>('SHORT_URL_BASE')
            .replace(/\/+$/, '');

        return urls.map((url) => ({
            id: url._id.toString(),
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${baseUrl}/${url.shortCode}`,
            clickCount: url.clickCount,
            createdAt: url.createdAt,
        }));
    }

    // Find the original URL and increment its redirect count.
    async getOriginalUrl(shortCode: string): Promise<string> {
        const url = await this.urlModel.findOneAndUpdate(
            { shortCode },
            { $inc: { clickCount: 1 } },
            { returnDocument: 'after' },
        )
        .exec();

        if (!url) {
            throw new NotFoundException('Short URL not found');
        }

        return url.originalUrl;
    }
}
