import { hash } from 'bcryptjs';
import prisma from "../src/lib/prisma"

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


  const password = await hash('password123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      password,
      role: 'ADMIN',
      school_id: 'inst001'
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'test1@test.com' },
    update: {},
    create: {
        email: 'test1@test.com',
        password: 'test1test1',
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
    update: {},
    create: {
        id: 'inst001_CS3213',
        code: 'CS3213',
        name: 'Foundations of Software Engineering',
        creator_id: teacher.id,
        school_id: teacher.school_id,
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
