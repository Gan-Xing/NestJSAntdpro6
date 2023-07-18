// create-user.dto.ts
export class CreateUserDto {
  email: string;
  password: string;
  role: string;
  status: string;
  username: string; // 添加用户名字段
  gender: number; // 添加性别字段
  departmentId: number; // 添加部门ID字段
}
