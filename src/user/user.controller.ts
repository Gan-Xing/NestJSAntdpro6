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
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@Controller('api/users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @ApiOkResponse({ description: 'User login.', type: UserEntity })
  @ApiBadRequestResponse({ description: 'Invalid credentials.' })
  async login(@Body() loginUserDto: LoginUserDto) {
    const userInDb = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    console.log(
      'user.emailuser.password,',
      loginUserDto.email,
      loginUserDto.password,
      'userInDb',
      userInDb,
    );
    if (!userInDb) {
      return { success: false };
    }
    return this.authService.login(userInDb);
  }

  @Post('refresh')
  @ApiCreatedResponse({ description: 'Refresh user token.' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Create a user.', type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.userService.create(createUserDto));
  }

  @Get()
  @ApiOkResponse({ description: 'Get all users.', type: [UserEntity] }) // 多个User的数组，使用type: [User]
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Find a user by id.', type: UserEntity }) // 单个User，直接使用type: User
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.userService.findOne(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ description: 'Update a user by id.', type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(await this.userService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete a user by id.', type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.userService.remove(id));
  }
}
