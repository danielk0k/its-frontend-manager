"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getUserProps() {
    const session = await auth();
    const session_user = session?.user;
    if (!session_user || !session_user.email) {
      redirect("/");
    }
    const user: User | null = await prisma.user.findUnique({
      where: { email: session_user.email },
    });
    return { props: { user: user } };
  }