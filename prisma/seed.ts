import { hash } from "bcryptjs";
import prisma from "../src/lib/prisma";
import { Role } from "@prisma/client";

// TODO: Place in env file
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "password123";

async function main() {
    const schools = await prisma.school.createMany({
        data: [
            { id: 'inst001', name: 'National University of Singapore' },
            { id: 'inst002', name: 'Nanyang Technological University' },
            { id: 'inst003', name: 'Singapore Management University' },
            { id: 'inst004', name: 'Singapore Institute of Management' },
            { id: 'inst005', name: 'Singapore University of Technology and Design' },
        ],
        skipDuplicates: true
    })
  const password = await hash(ADMIN_PASSWORD, 12);
  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: Role.ADMIN,
      school: {
        connect: {
          id: "inst001",
        },
      },
    },
    create: {
      email: ADMIN_EMAIL,
      password,
      role: Role.ADMIN,
      school: {
        connect: {
          id: "inst001",
        },
      },
    },
  });

  const teacher1 = await prisma.user.upsert({
    where: { email: 'test1@test.com' },
    update: {},
    create: {
        email: 'test1@test.com',
        password: 'test1test1',
        role: 'TEACHER',
        school_id: 'inst001'
    }
  })

  const teacher2 = await prisma.user.upsert({
    where: { email: 'test5@test.com' },
    update: {},
    create: {
        email: 'test5@test.com',
        password: 'test5test5',
        role: 'TEACHER',
        school_id: 'inst001'
    }
  })

  const stu1 = await prisma.user.upsert({
    where: { email: 'test2@test.com' },
    update: {},
    create: {
        email: 'test2@test.com',
        password: 'test2test2',
        role: 'STUDENT',
        school_id: 'inst001'
    }
  })
  const stu2 = await prisma.user.upsert({
    where: { email: 'test3@test.com' },
    update: {},
    create: {
        email: 'test3@test.com',
        password: 'test3test3',
        role: 'STUDENT',
        school_id: 'inst001'
    }
  })
  const stu3 = await prisma.user.upsert({
    where: { email: 'test4@test.com' },
    update: {},
    create: {
        email: 'test4@test.com',
        password: 'test4test4',
        role: 'STUDENT',
        school_id: 'inst001'
    }
  })

    const course1 = await prisma.course.upsert({
        where: { id: 'inst001_CS3213' },
        update: {
            id: 'inst001_CS3213',
            code: 'CS3213',
            name: 'Foundations of Software Engineering',
            creator_id: teacher1.id,
            school_id: teacher1.school_id,
        },
        create: {
            id: 'inst001_CS3213',
            code: 'CS3213',
            name: 'Foundations of Software Engineering',
            creator_id: teacher1.id,
            school_id: teacher1.school_id,
        },
    })

    const course2 = await prisma.course.upsert({
        where: { id: 'inst001_IS1103' },
        update: {
            id: 'inst001_IS1103',
            code: 'IS1103',
            name: 'Ethics in Computing',
            creator_id: teacher2.id,
            school_id: teacher2.school_id,
        },
        create: {
            id: 'inst001_IS1103',
            code: 'IS1103',
            name: 'Ethics in Computing',
            creator_id: teacher2.id,
            school_id: teacher2.school_id,
        },
    })
}
main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
