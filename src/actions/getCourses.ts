"use server";

import prisma from "@/lib/prisma";


export async function getCourses({ userEmail }: { userEmail: string }) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
        include: {
            created_courses: true,
            joined_courses: true,
        },
      });

      const courseUser = user;
  
      if (!user) {
        return null;
      }
      console.log(user)
      return courseUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  