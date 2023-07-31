import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuDto, UpdateMenuDto } from './dto';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    const { parentId, ...rest } = createMenuDto;

    if (parentId) {
      const parentMenu = await this.prisma.permissionGroup.findUnique({
        where: { id: parentId },
      });
      if (!parentMenu) {
        throw new Error(`Parent menu with id ${parentId} does not exist`);
      }
    }

    const data = {
      ...rest,
      parentId,
    };

    return await this.prisma.permissionGroup.create({ data });
  }

  async findAll() {
    return await this.prisma.permissionGroup.findMany({
      where: {
        parentId: null,
      },
      include: {
        permissions: true,
        children: {
          include: {
            children: true, // to some depth as needed
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.permissionGroup.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const existingMenu = await this.prisma.permissionGroup.findUnique({
      where: { id },
    });
    if (!existingMenu) {
      throw new Error(`Menu with id ${id} does not exist`);
    }

    const { parentId, ...rest } = updateMenuDto;

    if (parentId) {
      const parentMenu = await this.prisma.permissionGroup.findUnique({
        where: { id: parentId },
      });
      if (!parentMenu) {
        throw new Error(`Parent menu with id ${parentId} does not exist`);
      }
    }

    const data = {
      ...rest,
      parentId,
    };

    return await this.prisma.permissionGroup.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const existingMenu = await this.prisma.permissionGroup.findUnique({
      where: { id },
    });
    if (!existingMenu) {
      throw new Error(`Menu with id ${id} does not exist`);
    }

    // Recursively remove all child menus
    const childMenus = await this.prisma.permissionGroup.findMany({
      where: { parentId: id },
    });
    for (const childMenu of childMenus) {
      await this.remove(childMenu.id);
    }

    return await this.prisma.permissionGroup.delete({
      where: { id },
    });
  }
}
