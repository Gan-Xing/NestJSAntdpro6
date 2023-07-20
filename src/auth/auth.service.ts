//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  generateRefreshToken() {
    // 这里你可以添加生成refreshToken的逻辑
    // 可以使用相似jwtService.sign方法或者你自己的实现
    return 'REFRESH_TOKEN';
  }

  async refreshToken(refreshToken: string) {
    // 在这个函数中，你需要根据传入的refreshToken生成一个新的accessToken
    // 这通常涉及到验证refreshToken是否有效，然后生成新的accessToken
    // 注意：这需要你自己实现，因为具体的实现方式取决于你如何生成和验证refreshToken
    const newAccessToken = 'NEW_ACCESS_TOKEN';

    return {
      success: true,
      token: newAccessToken,
      refreshToken: this.generateRefreshToken(),
    };
  }
}
