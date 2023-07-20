import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ArticlesModule } from './articles/articles.module';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PasswordModule } from './password/password.module';
import authConfig from './config/auth.config';
import commonConfig from './common/configs/config';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ArticlesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, commonConfig],
    }),
    PasswordModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
