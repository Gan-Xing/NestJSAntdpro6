import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  // user.service.ts
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(createUserDto.password, 10); // 使用bcrypt进行密码加密

    // 在这里处理一个角色ID数组
    const roles = await this.prisma.role.findMany({
      where: { id: { in: createUserDto.roles } },
    });

    if (roles.length !== createUserDto.roles.length) {
      throw new Error(`Some roles do not exist`);
    }

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        roles: {
          connect: roles.map((role) => ({ id: role.id })), // 连接多个角色
        },
        status: createUserDto.status,
        username: createUserDto.username,
        gender: createUserDto.gender,
        departmentId: createUserDto.departmentId,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { roles, ...otherData } = updateUserDto;

    let rolesUpdate;

    if (roles) {
      // 如果传递了角色ID，处理它们
      const roleObjects = await this.prisma.role.findMany({
        where: { id: { in: roles } },
      });

      if (roleObjects.length !== roles.length) {
        throw new Error(`Some roles do not exist`);
      }

      rolesUpdate = {
        connect: roleObjects.map((role) => ({ id: role.id })),
      };
    }

    return this.prisma.user.update({
      where: { id: id },
      data: {
        ...otherData,
        ...(rolesUpdate && { roles: rolesUpdate }),
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async createAdminUser() {
    // 先查找是否已经存在管理员用户
    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    // 如果已存在管理员用户，则不再创建
    if (existingAdmin) {
      return;
    }

    // 否则创建新的管理员用户
    const hashedPassword = await hash('admin23', 10); // 这里的密码应该更加复杂且难以猜测

    let adminRole = await this.prisma.role.findUnique({
      where: { name: 'admin' }, // 尝试找一个名为 "admin" 的角色
    });

    // 如果admin角色不存在，则创建一个
    if (!adminRole) {
      adminRole = await this.prisma.role.create({
        data: { name: 'admin' },
      });
    }

    return this.prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        roles: {
          connect: { id: adminRole.id },
        },
        status: 'Active',
        username: 'Admin',
        gender: 1,
        departmentId: 1, // 这个部门 ID 应该是存在的
      },
    });
  }

  async createDebugUsers() {
    let userRole = await this.prisma.role.findUnique({
      where: { name: 'user' },
    });

    if (!userRole) {
      userRole = await this.prisma.role.create({
        data: { name: 'user' },
      });
    }

    for (let i = 0; i < 10; i++) {
      // 创建10个调试用户
      const hashedPassword = await hash(`user${i}Pass`, 10);

      await this.prisma.user.create({
        data: {
          email: `user${i}@example.com`,
          password: hashedPassword,
          roles: {
            connect: { id: userRole.id },
          },
          status: 'Active',
          username: `User${i}`,
          gender: i % 2, // 交替性别
          departmentId: 1,
        },
      });
    }
  }
}
