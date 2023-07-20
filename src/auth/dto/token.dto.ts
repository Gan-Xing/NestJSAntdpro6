import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class Token {
  @IsString()
  @IsJWT()
  @IsNotEmpty()
  @ApiProperty()
  accessToken: string;

  @IsString()
  @IsJWT()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}
