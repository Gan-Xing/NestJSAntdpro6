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
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
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
    return this.prisma.user.delete({ where: { id } });
  }
}
