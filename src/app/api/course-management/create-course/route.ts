import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

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
    const { user_id, user_role, school_id, code, name } =
      (await req.json()) as {
        user_id: string;
        user_role: Role;
        school_id: string;
        code: string;
        name: string;
      };

    // const courseCreator = await prisma.user.findUnique({
    //     where: {
    //         email: email,
    //     }
    // });

    // if (courseCreator == undefined) {
    //     return new NextResponse(
    //         JSON.stringify({
    //           status: 'error',
    //           message: 'Not a valid user.',
    //         }),
    //         { status: 500 }
    //       );
    // } else if (courseCreator.role !== 'TEACHER') {
    //     return new NextResponse(
    //         JSON.stringify({
    //           status: 'error',
    //           message: 'You do not have the permission to make this request.',
    //         }),
    //         { status: 500 }
    //       );
    // }

    if (user_role !== Role.TEACHER) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "You do not have the permission to make this request.",
        }),
        { status: 500 }
      );
    }
    // const courseId = courseCreator.school_id + "_" + code;

    // const duplicateCourse = await prisma.course.findUnique({
    //     where: {
    //         id: courseId,
    //     }
    // })

    // if (duplicateCourse !== null) {
    //     return new NextResponse(
    //         JSON.stringify({
    //           status: 'error',
    //           message: 'Course already exists.',
    //         }),
    //         { status: 500 }
    //       );
    // }

    const courseToCreate = await prisma.course.create({
      data: {
        id: school_id + "_" + code,
        code: code,
        name: name,
        creator_id: user_id,
        school_id: school_id,
      },
    });

    return NextResponse.json({
      courseToCreate,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
