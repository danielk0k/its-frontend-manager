import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prisma';

// example usage:
// const adminemail = {
//     email: 'admin@admin.com',
// };

// make the api GET call with query string being admin's email, one way of doing it is:
// const res3 = await fetch(process.env.URL + '/api/get-data/get-students?email=' + adminemail.email, {
//     method: 'GET',
// });

// const data = await res3.json();

// console.log(data);

export async function GET(req: NextRequest) {
  try {
    const adminEmail = req.nextUrl.searchParams.get('email');               

    if (adminEmail !== undefined) {
        const adminUser = await prisma.user.findUnique({
            where: {
                email: adminEmail,
                role: 'ADMIN',
            },
        });

        if (adminUser !== undefined) {
            const students = await prisma.user.findMany({
                where: {
                    school_id: adminUser?.school_id,
                },
                select: {
                    email: true,
                    role: true,
                    school_id: true,
                }
            });
    
            return NextResponse.json({
                students
            });
        } else {
            return new NextResponse(
                JSON.stringify({
                  status: 'error',
                  message: 'You are not an admin.',
                }),
                { status: 500 }
            );
        }
        
        
    } else {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'Email provided is invalid.',
            }),
            { status: 500 }
        );
    }
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
