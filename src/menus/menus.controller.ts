import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto, UpdateMenuDto } from './dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/common';
import { PermissionEntity } from 'src/permissions/entities';

@Controller('api/menus')
@ApiTags('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @ApiBearerAuth()
  @Permissions(new PermissionEntity({ action: 'POST', path: '/menus' }))
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  @ApiBearerAuth()
  @Permissions(new PermissionEntity({ action: 'GET', path: '/menus' }))
  async findAllPaged(
    @Query('current', new ParseIntPipe()) current: number,
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('name') name?: string,
  ) {
    return await this.menusService.findAllPaged(current, pageSize, name);
  }

  @Get('/all')
  @ApiBearerAuth()
  @Permissions(new PermissionEntity({ action: 'GET', path: '/menus' }))
  async findAll() {
    return await this.menusService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Permissions(new PermissionEntity({ action: 'GET', path: '/menus' }))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menusService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Permissions(new PermissionEntity({ action: 'PATCH', path: '/menus' }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete menus by their IDs.' })
  @Permissions(new PermissionEntity({ action: 'DELETE', path: '/menus' }))
  async removeByIds(@Body('ids', ParseArrayPipe) ids: number[]) {
    return this.menusService.removeMenusByIds(ids);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Permissions(new PermissionEntity({ action: 'DELETE', path: '/menus' }))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menusService.remove(id);
  }
}
