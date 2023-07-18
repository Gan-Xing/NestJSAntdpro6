// user.entity.ts
import { Role } from '@prisma/client';

export class User {
  id: number;
  email: string;
  password: string;
  status: string;
  username: string;
  gender: string;
  departmentId: number;
  roles: Role[];
}
