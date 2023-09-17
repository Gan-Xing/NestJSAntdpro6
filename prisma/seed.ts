import { PrismaClient } from '@prisma/client';
import { fakerZH_CN as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await createRoles();
  await createPermissionGroups();
  await createPermissions();
  await createUsers();
  await createArticles();
}

async function createRoles() {
  for (let i = 0; i < 10; i++) {
    const roleName = `role${i}`;
    const existingRole = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!existingRole) {
      await prisma.role.create({
        data: { name: roleName },
      });
    }
  }
}

async function createPermissionGroups() {
  for (let i = 0; i < 10; i++) {
    await prisma.permissionGroup.create({
      data: {
        name: faker.commerce.department(),
      },
    });
  }
}

async function createPermissions() {
  const groups = await prisma.permissionGroup.findMany();
  const roles = await prisma.role.findMany();

  for (let i = 0; i < 10; i++) {
    await prisma.permission.create({
      data: {
        name: faker.lorem.word(),
        action: faker.lorem.word(),
        path: faker.internet.url(),
        permissionGroupId: groups[Math.floor(Math.random() * groups.length)].id,
        roles: {
          connect: roles
            .slice(0, Math.floor(Math.random() * roles.length + 1))
            .map((role) => ({ id: role.id })),
        },
      },
    });
  }
}

async function createUsers() {
  const roles = await prisma.role.findMany();

  for (let i = 0; i < 100; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        username: faker.internet.userName(),
        gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
        departmentId: Math.floor(Math.random() * 10) + 1,
        isAdmin: faker.datatype.boolean(),
        avatar: faker.internet.avatar(),
        roles: {
          connect: roles
            .slice(0, Math.floor(Math.random() * roles.length + 1))
            .map((role) => ({ id: role.id })),
        },
      },
    });
  }
}

async function createArticles() {
  const users = await prisma.user.findMany();

  for (let i = 0; i < 10; i++) {
    await prisma.article.create({
      data: {
        title: faker.lorem.words(5),
        description: faker.lorem.sentences(3),
        body: faker.lorem.paragraphs(3),
        published: faker.datatype.boolean(),
        authorId: users[Math.floor(Math.random() * users.length)].id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
