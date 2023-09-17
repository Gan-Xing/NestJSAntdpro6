# 使用官方 Node.js 18 图像作为基础图像
FROM node:18

# 创建应用程序目录
WORKDIR /usr/src/app

# 安装应用程序依赖项
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# 拷贝应用代码
COPY . .

# 在此处生成 Prisma 客户端
RUN npx prisma generate

# 编译 NestJS 项目
RUN pnpm run build

# 拷贝入口点脚本
COPY entrypoint.sh ./entrypoint.sh

# 开放端口
EXPOSE 3030

# 给脚本执行权限
RUN chmod +x entrypoint.sh

# 设置脚本为入口点
ENTRYPOINT [ "./entrypoint.sh" ]
