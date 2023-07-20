import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey', // 这应该是你自己的密钥
      signOptions: { expiresIn: '60m' }, // JWT 过期时间
    }),
    PrismaModule,
    // 其他需要的模块...
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
