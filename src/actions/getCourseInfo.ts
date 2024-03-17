"use server";

import prisma from "@/lib/prisma";

export async function getCourseInfo({ courseId }: { courseId: string }) {
  try {
    console.log(courseId)
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        questions: true,
      },
    });

    if (!course) {
      return null;
    }
    console.log(course)
    return course;
  } catch (error) {
    console.error(error);
    return null;
  }
}
