import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsInt, IsArray } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  gender: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  departmentId: number;

  @ApiProperty({ isArray: true, type: 'number' }) // 修改为角色 ID 数组
  @IsArray()
  @IsInt({ each: true }) // 确保每个元素都是一个整数
  roles: number[]; // 修改为数字数组，表示角色ID
}
