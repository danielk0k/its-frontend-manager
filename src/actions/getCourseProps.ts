import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import { Course } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getCourseProps(courseId: string) {
  try {
    const session = await auth();
    const session_user = session?.user;
    if (!session_user || !session_user.email) {
      redirect("/");
    }
    const user: User | null = await prisma.user.findUnique({
      where: { email: session_user.email },
    });

    const course: Course | null = await prisma.course.findUnique({
      where: {
        id: user?.school_id + "_" + courseId.toUpperCase(),
      },
    });
    return { props: { course: course } };
  } catch (error) {
    console.error("Error fetching course:", error);
    return {
      course: null,
    };
  }
}
