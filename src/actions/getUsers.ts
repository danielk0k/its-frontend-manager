"use server"

import prisma from "@/lib/prisma";
import { Role, User } from "@prisma/client";

export async function getUsers(user: User) {
  try {
    if (user.role == Role.ADMIN) {
      const users = await prisma.user.findMany({
        where: {
          school_id: user.school_id,
        },
      });

      return users;
    } else {
      throw new Error("User is not admin");
    }
  } catch (error) {
    console.error(error);
    
  }
}
