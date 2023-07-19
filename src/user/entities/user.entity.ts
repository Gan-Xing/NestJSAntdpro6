import { Role } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  username: string;

  @ApiPropertyOptional() // Optional properties may be undefined or null
  gender: number;

  @ApiProperty()
  departmentId: number;

  @ApiProperty({ isArray: true, description: '角色对象数组' })
  roles: Role[];
}
