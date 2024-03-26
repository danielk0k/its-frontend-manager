import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(req: NextRequest) {
  try {
    const { email, password, institution } = (await req.json()) as {

      email: string;
      password: string;
      institution: string;
    };
    const hashed_password = await hash(password, 12);


    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed_password,
        school_id: institution,
        role: 'STUDENT'
      },
    });

    return NextResponse.json({
      user: {
        email: user.email,
        school_id: user.school_id,
        role: user.role,
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
