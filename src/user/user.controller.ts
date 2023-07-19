import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { User } from './entities/user.entity';

@Controller('api/users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @ApiOkResponse({ description: 'User login.', type: User })
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
  @ApiCreatedResponse({ description: 'Create a user.', type: User })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Get all users.', type: [User] }) // 多个User的数组，使用type: [User]
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Find a user by id.', type: User }) // 单个User，直接使用type: User
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ description: 'Update a user by id.', type: User })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete a user by id.', type: User })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
