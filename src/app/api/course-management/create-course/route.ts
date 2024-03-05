import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// example usage:
// const reqdata = {
//     email: 'test1@test.com',
//     code: 'CS3213',
//     name: 'Foundations of Software Engineering',
// };

// const res4 = await fetch(process.env.URL + '/api/course-management/create-course', {
//     method: 'POST',
//     body: JSON.stringify(reqdata),
// });

// const resbody = await res4.json();

// console.log(resbody);

export async function POST(req: Request) {
  try {
    const { email, code, name } = (await req.json()) as {
        email: string,
        code: string,
        name: string,
    };

    const courseCreator = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if (courseCreator == undefined) {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'Not a valid user.',
            }),
            { status: 500 }
          );
    } else if (courseCreator.role !== 'TEACHER') {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'You do not have the permission to make this request.',
            }),
            { status: 500 }
          );
    }

    const courseId = courseCreator.school_id + "_" + code;

    const duplicateCourse = await prisma.course.findUnique({
        where: {
            id: courseId,
        }
    })

    if (duplicateCourse !== null) {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'Course already exists.',
            }),
            { status: 500 }
          );
    }

    const courseToCreate = await prisma.course.create({
        data: {
            id: courseId,
            code: code,
            name: name,
            creator_id: courseCreator.id,
            school_id: courseCreator.school_id,
        },
    })

    return NextResponse.json({
        courseToCreate
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

