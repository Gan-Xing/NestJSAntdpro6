#!/bin/bash

# 等待数据库变得可用
until echo > /dev/tcp/db/5432; do
  echo "Waiting for PostgreSQL..."
  sleep 1
done

echo "PostgreSQL is up - executing command"

# 运行 Prisma 迁移和生成客户端
npx prisma migrate deploy

# 启动 NestJS 应用程序
exec pnpm run start:prod
