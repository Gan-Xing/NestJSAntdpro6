import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { RoleEntity } from './entities';

@Controller('api/roles')
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Create a role.', type: RoleEntity })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return new RoleEntity(await this.rolesService.create(createRoleDto));
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get all roles.', type: [RoleEntity] })
  async findAll() {
    const roles = await this.rolesService.findAll();
    return roles.map((role) => new RoleEntity(role));
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Delete multiple roles by ids.',
    type: RoleEntity,
  })
  async removeMany(@Body() idsDto: { ids: number[] }) {
    return await this.rolesService.removeMany(idsDto.ids);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Find a role by id.', type: RoleEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new RoleEntity(await this.rolesService.findOne(id));
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Update a role by id.', type: RoleEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return new RoleEntity(await this.rolesService.update(id, updateRoleDto));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete a role by id.', type: RoleEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new RoleEntity(await this.rolesService.remove(id));
  }
}
