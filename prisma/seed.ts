import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      password,
      role: 'ADMIN',
      school_id: 'inst001'
    },
  });

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
  console.log({ user });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
