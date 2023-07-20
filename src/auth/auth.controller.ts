// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Public } from '../public.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { Token } from './dto/token.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @ApiOkResponse({ type: Token })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Invalid password' })
  @ApiNotFoundResponse({ description: 'No user found for email' })
  async login(@Body() { email, password }: LoginDto) {
    const { accessToken, refreshToken } = await this.auth.login(
      email.toLowerCase(),
      password,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  @Public()
  @Post('register')
  @ApiCreatedResponse({ type: Token })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  async register(@Body() createUserDto: RegisterDto) {
    return this.auth.register(createUserDto);
  }
  @Post('refresh')
  @ApiCreatedResponse({ description: 'Refresh user token.' })
  async refresh(@Body('refreshToken') { refreshToken }: RefreshTokenDto) {
    return this.auth.refreshToken(refreshToken);
  }
}
