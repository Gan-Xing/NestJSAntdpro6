import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { PermissiongroupsModule } from 'src/permissiongroups/permissiongroups.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, PermissiongroupsModule],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
