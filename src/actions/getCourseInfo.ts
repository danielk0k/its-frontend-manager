"use server";

import prisma from "@/lib/prisma";

// example usage:
// const userEmail = {
//     email: 'test2@test.com',
// };

// make the api GET call with query string being admin's email, one way of doing it is:
// const res3 = await fetch(process.env.URL + '/api/get-data/get-my-courses?email=' + userEmail.email, {
//     method: 'GET',
// });

// const data = await res3.json();

// console.log(data);

export async function getCourseInfo({ courseId }: { courseId: string }) {
  try {
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
