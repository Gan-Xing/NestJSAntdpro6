import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey', // 这应该是你自己的密钥
      signOptions: { expiresIn: '60m' }, // JWT 过期时间
    }),
    // 其他需要的模块...
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}