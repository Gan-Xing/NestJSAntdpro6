//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtConfig, SecurityConfig } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/password/password.service';
import { RegisterDto, Token } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}
  async register(registerUser: RegisterDto): Promise<Token> {
    // 确保邮箱是唯一的
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerUser.email },
    });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      registerUser.password,
    );

    // 设定默认的用户角色
    const defaultRole = await this.prisma.role.findUnique({ where: { id: 2 } });
    if (!defaultRole) {
      throw new Error('Default role does not exist');
    }

    const user = await this.prisma.user.create({
      data: {
        email: registerUser.email,
        password: hashedPassword,
        roles: {
          connect: [{ id: defaultRole.id }], // 连接到默认角色
        },
        status: 'ACTIVE', // 或其他你认为适合的默认状态
        username: registerUser.username,
        // 根据你的业务逻辑设定默认的gender和departmentId
        gender: 0,
        departmentId: 1,
      },
    });

    // Return a JWT
    return this.generateTokens({
      userId: user.id,
    });
  }

  async login(email: string, password: string): Promise<Token> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return this.generateTokens({
      userId: user.id,
    });
  }

  validateUser(userId: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: number }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const jwtConfig = this.configService.get<JwtConfig>('jwt');

    return this.jwtService.sign(payload, {
      secret: jwtConfig.refreshSecret,
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const jwtConfig = this.configService.get<JwtConfig>('jwt');
      const { userId } = this.jwtService.verify(token, {
        secret: jwtConfig.refreshSecret,
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
