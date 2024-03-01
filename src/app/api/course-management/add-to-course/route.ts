import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// example usage:
// const reqdata = {
//     requestorEmail: 'test1@test.com',
//     courseId: 'inst001_CS3213',
//     emailsToAdd: ['test2@test.com', 'test3@test.com'],
// }

// const res5 = await fetch(process.env.URL + '/api/course-management/add-to-course', {
//     method: 'POST',
//     body: JSON.stringify(reqdata),
// });

// const resbody = await res5.json();

// console.log(resbody);

export async function POST(req: Request) {
  try {
    const { requestorEmail, courseId, emailsToAdd } = (await req.json()) as {
      requestorEmail: string,
      courseId: string,
      emailsToAdd: string[],
    };

    const requestor = await prisma.user.findUnique({
        where: {
            email: requestorEmail,
        },
    })

    if (requestor == undefined || requestor == null) {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'Not a valid user.',
            }),
            { status: 500 }
          );
    } else if (requestor.role !== 'TEACHER') {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'You do not have the permission to make this request.',
            }),
            { status: 500 }
          );
    }

    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
    })

    if (course == undefined || course == null) {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'Invalid course ID.',
            }),
            { status: 500 }
          );
    }

    var addedUsers: string[] = [];

    for (const email of emailsToAdd) {
        const added = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                joined_courses: {
                    connect: {
                        id: courseId,
                    },
                },
            },
        });

        if (added !== null && added.email !== null) {
            addedUsers.push(added.email);
        }
        
    }

    return NextResponse.json({
      addedUsers: addedUsers
    });
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
