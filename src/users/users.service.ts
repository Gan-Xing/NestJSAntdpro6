import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/password/password.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}
  // user.service.ts
  async create(createUser: CreateUserDto): Promise<User> {
    const hashedPassword = await this.passwordService.hashPassword(
      createUser.password,
    );

    // 在这里处理一个角色ID数组
    const roles = await this.prisma.role.findMany({
      where: { id: { in: createUser.roles } },
    });

    if (roles.length !== createUser.roles.length) {
      throw new Error(`Some roles do not exist`);
    }

    return this.prisma.user.create({
      data: {
        avatar:
          createUser?.avatar || 'https://gravatar.com/avatar/0000?d=mp&f=y',
        isAdmin: false,
        email: createUser.email,
        password: hashedPassword,
        roles: {
          connect: roles.map((role) => ({ id: role.id })), // 连接多个角色
        },
        status: createUser.status,
        username: createUser.username,
        gender: createUser.gender,
        departmentId: createUser.departmentId,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        roles: true,
      },
    });
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
    if (updateUserDto.password) {
      updateUserDto.password = await this.passwordService.hashPassword(
        updateUserDto.password,
      );
    }

    return this.prisma.user.update({
      where: { id: id },
      data: {
        ...otherData,
        ...(rolesUpdate && { roles: rolesUpdate }),
      },
    });
  }

  removeByIds(ids: number[]) {
    return this.prisma.user.deleteMany({ where: { id: { in: ids } } });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
