import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';




export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(30)
    name!: string;

    @IsEmail()
    @MaxLength(100)
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password!: string;
}