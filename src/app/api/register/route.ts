import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';

export async function POST(req: Request) {
  try {
    const { email, password, school_id } = (await req.json()) as {

      email: string;
      password: string;
      school_id: string;
    };
    const hashed_password = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed_password,
        school_id: school_id,
        role: 'STUDENT'
      },
    });

    return NextResponse.json({
      user: {

        email: user.email,
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
