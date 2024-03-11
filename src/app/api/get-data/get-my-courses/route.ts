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
    const userEmail = req.nextUrl.searchParams.get('email');

    if (!userEmail) {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'Invalid query parameter.',
            }),
            { status: 500 }
          );
    }
    const user = await prisma.user.findUnique({
        where: {
            email: userEmail,
        },
        include: {
            created_courses: true,
            joined_courses: true,
        },
    })

    if (user == null || user == undefined) {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'User not found.',
            }),
            { status: 500 }
          );
    }

    const myCourses = user.created_courses.concat(user.joined_courses);

    return NextResponse.json({
        myCourses
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
