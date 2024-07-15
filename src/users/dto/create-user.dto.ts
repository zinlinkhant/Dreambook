import { IsString, IsEmail, MinLength, IsEnum, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '../entities/gender.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  bio: string;

  @Transform(({ value }) => value?.[0])
  profileImg: any;

  @IsEnum(Gender)
  gender: Gender;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
