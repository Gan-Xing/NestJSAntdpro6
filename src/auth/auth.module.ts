import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { PasswordService } from '../password/password.service';
import { PasswordModule } from 'src/password/password.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ConfigModule,
    PasswordModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        console.log('securityConfig:', securityConfig);
        return {
          secret: configService.get<string>('auth.jwtAccessSecret'),
          signOptions: {
            expiresIn: securityConfig.expiresIn, // e.g. 30s, 7d, 24h
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PasswordService],
  exports: [AuthService, PasswordService], // 导出 PasswordService
})
export class AuthModule {}
