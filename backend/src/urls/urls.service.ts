import {
    ConflictException,
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
import { GetUrlsQueryDto } from './dto/get-urls.dto.js';



@Injectable()
export class UrlsService {
    constructor(
        @InjectModel(ShortUrl.name)
        private readonly urlModel: Model<ShortUrl>,
        private readonly _configService: ConfigService,
    ) {}


    async createUrl(createUrlDto: CreateUrlDto, userId: string) {
        const ownerId = new Types.ObjectId(userId);

        const existingUrl = await this.urlModel.findOne({
            originalUrl: createUrlDto.originalUrl,
            userId: ownerId,
        }).exec();

        if (existingUrl) {
            throw new ConflictException('You have already shortened this URL.');
        }

        for (let attempt = 0; attempt < 5; attempt++) {
            const shortCode = this.generateShortCode();

            try {
                const savedUrlDoc = await this.urlModel.create({
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
                    id: savedUrlDoc._id.toString(),
                    originalUrl: savedUrlDoc.originalUrl,
                    shortCode: savedUrlDoc.shortCode,
                    shortUrl: `${baseUrl}/${savedUrlDoc.shortCode}`,
                    clickCount: savedUrlDoc.clickCount,
                    createdAt: savedUrlDoc.createdAt,
                };

            } catch (error: unknown) {
                const duplicateKey =
                    typeof error === 'object' &&
                    error !== null &&
                    'code' in error &&
                    error.code === 11000;

                if (duplicateKey) {
                    continue;
                }

                throw error;
            }
        }

        throw new ServiceUnavailableException(
            'Could not generate a unique short code. Please try again.',
        );
    }


    async deleteUrl(urlId: string, userId: string) {
        if (!Types.ObjectId.isValid(urlId)) {
            throw new NotFoundException('Short URL not found');
        }

        const deletedUrl = await this.urlModel.findOneAndDelete({
            _id: new Types.ObjectId(urlId),
            userId: new Types.ObjectId(userId),
        }).exec();

        if (!deletedUrl) {
            throw new NotFoundException('Short URL not found');
        }

        return {
            message: 'Short URL deleted successfully',
        };
    }

    
    async getUserUrls(userId: string, query: GetUrlsQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 5;
        const search = query.search?.trim() ?? '';
        const skip = (page - 1) * limit;

        const filter = {
            userId: new Types.ObjectId(userId),
        };

        if (search) {
            // Escape special regex characters supplied by the user.
            const escapedSearch = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&',
            );

            Object.assign(filter, {
                $or: [
                    { originalUrl: { $regex: escapedSearch, $options: 'i' } },
                    { shortCode: { $regex: escapedSearch, $options: 'i' } },
                ],
            });
        }

        const [urls, total] = await Promise.all([
            this.urlModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec(),

            this.urlModel.countDocuments(filter).exec(),
        ]);


        const baseUrl = this._configService
            .getOrThrow<string>('SHORT_URL_BASE')
            .replace(/\/+$/, '');


        const data = urls.map((url) => ({
            id: url._id.toString(),
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${baseUrl}/${url.shortCode}`,
            clickCount: url.clickCount,
            createdAt: url.createdAt,
        }));

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    
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


    private generateShortCode(): string {
        return randomBytes(6).toString('base64url');
    }
}
