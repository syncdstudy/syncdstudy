import { PrismaClient, Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const hashedPassword = await hash('changeme', 10);

  // Create users
  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;
    const { email } = account;
    // const password = account.password || 'changeme';

    console.log(`  Creating user: ${email} with role: ${role}`);

    // eslint-disable-next-line no-await-in-loop
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        role,
      },
    });
  }

  // Fetch created users
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: config.defaultAccounts.map((acc) => acc.email),
      },
    },
  });

  // Create and seed courses
  for (const courseName of config.defaultCourses || []) {
    console.log(`  Creating or finding course: ${courseName}`);

    // eslint-disable-next-line no-await-in-loop
    const course = await prisma.course.upsert({
      where: { name: courseName },
      update: {},
      create: {
        name: courseName,
      },
    });

    for (const user of users) {
      console.log(`    Enrolling ${user.email} in ${courseName}`);
      // eslint-disable-next-line no-await-in-loop
      await prisma.course.update({
        where: { id: course.id },
        data: {
          users: {
            connect: { id: user.id },
          },
        },
      });

      // eslint-disable-next-line no-await-in-loop
      await prisma.courseNotificationPreference.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          courseId: course.id,
          notify: courseName === 'ICS 314', // Enable only for ICS 314
        },
      });
    }
  }

  // Seed Stuff
  for (const data of config.defaultData) {
    const condition = (data.condition as Condition) || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);

    // eslint-disable-next-line no-await-in-loop
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
