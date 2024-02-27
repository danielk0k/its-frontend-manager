import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prisma';

// example usage:
// const emaildata = {
//     email: 'test1@test.com',
// };

// const res1 = await fetch(process.env.URL + '/api/user-management/promote-to-teacher', {
//     method: 'POST',
//     body: JSON.stringify(emaildata),
// });

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as {
      email: string;
    };

    const promoteToTeacher = await prisma.user.update({

      where: {
        email: email,
      },
      data: {
        role: 'TEACHER',
      }
    });

    return NextResponse.json({
      promoted: {
        email: promoteToTeacher.email,
        updatedrole: promoteToTeacher.role,
      },
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

