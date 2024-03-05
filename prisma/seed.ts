import { hash } from "bcryptjs";
import prisma from "../src/lib/prisma";
import { Role } from "@prisma/client";

// TODO: Place in env file
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "password123";

async function main() {
  const schools = await prisma.school.createMany({
    data: [
      { id: "inst001", name: "National University of Singapore" },
      { id: "inst002", name: "Nanyang Technological University" },
      { id: "inst003", name: "Singapore Management University" },
      { id: "inst004", name: "Singapore Institute of Management" },
      { id: "inst005", name: "Singapore University of Technology and Design" },
    ],
    skipDuplicates: true,
  });

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

  console.log({ user });
}
main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
