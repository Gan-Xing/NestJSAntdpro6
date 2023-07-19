import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

// Initialize the Prisma Client
const prisma = new PrismaClient();

async function createAdminUser() {
  // First, check if an admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  // If an admin user already exists, do not create a new one
  if (existingAdmin) {
    return;
  }

  // Otherwise, create a new admin user
  const hashedPassword = await hash('admin23', 10); // The password should be more complex and difficult to guess

  let adminRole = await prisma.role.findUnique({
    where: { name: 'admin' }, // Try to find a role named "admin"
  });

  // If the admin role doesn't exist, create it
  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: 'admin' },
    });
  }

  return prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      roles: {
        connect: { id: adminRole.id },
      },
      status: 'Active',
      username: 'Admin',
      gender: 1,
      departmentId: 1, // This department ID should exist
    },
  });
}

async function createDebugUsers() {
  let userRole = await prisma.role.findUnique({
    where: { name: 'user' },
  });

  if (!userRole) {
    userRole = await prisma.role.create({
      data: { name: 'user' },
    });
  }

  for (let i = 0; i < 10; i++) {
    // Create 10 debug users
    const email = `user${i}@example.com`;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      const hashedPassword = await hash(`user${i}Pass`, 10);
      await prisma.user.create({
        data: {
          email: `user${i}@example.com`,
          password: hashedPassword,
          roles: {
            connect: { id: userRole.id },
          },
          status: 'Active',
          username: `User${i}`,
          gender: i % 2, // Alternate gender
          departmentId: 1,
        },
      });
    }
  }
}

async function createArticles() {
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {},
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
    },
  });

  console.log({ post1, post2 });
}

async function seed() {
  await createAdminUser();
  await createDebugUsers();
  await createArticles();
}

// Execute the seed function
seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma Client at the end
    await prisma.$disconnect();
  });
