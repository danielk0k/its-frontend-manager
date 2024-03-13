import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

export async function GET(req: NextRequest) {
  try {
    const courseId = req.nextUrl.searchParams.get('courseId');

    if (!courseId) {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'Invalid query parameter.',
            }),
            { status: 500 }
          );
    }
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            questions: true,
        }
    })

    if (course == null || course == undefined) {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'Course not found.',
            }),
            { status: 500 }
          );
    }

    return NextResponse.json({
        status: 'success',
        course
    })

  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
