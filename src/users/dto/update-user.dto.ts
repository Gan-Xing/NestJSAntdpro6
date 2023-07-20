import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsInt,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsInt()
  gender?: number;

  @IsOptional()
  @IsInt()
  departmentId?: number;
}
