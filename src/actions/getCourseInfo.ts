"use server";

import prisma from "@/lib/prisma";

export async function getCourseInfo({ courseId }: { courseId: string }) {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        questions: true,
        members: true,
      },
    });

    if (!course) {
      return null;
    }
    return course;
  } catch (error) {
    console.error(error);
    return null;
  }
}
