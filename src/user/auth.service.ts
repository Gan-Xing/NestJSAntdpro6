// user/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    console.log('Fetched user: ', user); // print out the fetched user

    if (user) {
      const passwordMatches = await bcrypt.compare(password, user.password);
      console.log('Password matches: ', passwordMatches); // print out the result of password comparison

      if (passwordMatches) {
        const { password: _, ...result } = user;
        return result;
      }
    }

    return null;
  }

  generateRefreshToken() {
    // 这里你可以添加生成refreshToken的逻辑
    // 可以使用相似jwtService.sign方法或者你自己的实现
    return 'REFRESH_TOKEN';
  }

  async login(user: User) {
    const payload = { email: user.email, id: user.id };
    return {
      success: true,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.generateRefreshToken(),
    };
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
