import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateUrlDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(2048)
    @IsUrl({
        protocols: ['http', 'https'],
        require_protocol: true,
        require_valid_protocol: true,
    })
    originalUrl!: string;
}