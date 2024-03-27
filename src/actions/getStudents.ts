import prisma from "@/lib/prisma";
import { Role, User } from "@prisma/client";

export async function getStudents(user: User) {
  try {
    if (user.role === Role.TEACHER) {
      const students = await prisma.user.findMany({
        where: {
          school_id: user.school_id,
          role: Role.STUDENT, 
        },
        select: {
          email: true,
          role: true,
          school_id: true,
        },
      });

      return students;
    } else {
      throw new Error("User is not a teacher");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
