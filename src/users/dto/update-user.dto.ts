import { IsString, IsOptional, IsEmail, MinLength, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '../entities/gender.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @Transform(({ value }) => value?.[0])
  profileImg: any;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(6)
  password: string;
}
