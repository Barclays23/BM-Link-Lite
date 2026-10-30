import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';



export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  name!: string;

  @IsEmail()
  @MaxLength(50)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password!: string;
}