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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@Controller('api/users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Create a user.', type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get()
  // @UseGuards(JwtAuthGuard) //单独针对某个路由进行权限控制，目前已经做了全局控制，此处可以删除
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get all users.', type: [UserEntity] }) // 多个User的数组，使用type: [User]
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Find a user by id.', type: UserEntity }) // 单个User，直接使用type: User
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findOne(id));
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Update a user by id.', type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete a user by id.', type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.remove(id));
  }
}
