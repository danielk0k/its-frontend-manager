import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// example usage:
// const emailsdata = {
//     emails: ['test2@test.com', 'test3@test.com']
// };

// const res2 = await fetch(process.env.URL + '/api/user-management/bulk-promote-to-teacher', {
//     method: 'POST',
//     body: JSON.stringify(emailsdata),
// });

export async function POST(req: Request) {
  try {
    const { emails } = (await req.json()) as {
      emails: string[];
    };

    const promoteToTeachers = await prisma.user.updateMany({

      where: {
        email: {
            in: emails,
        },
      },
      data: {
        role: 'TEACHER',
      }
    });

    return NextResponse.json({
      promoteToTeachers
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
