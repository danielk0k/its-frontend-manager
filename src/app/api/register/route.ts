import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
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
        school_id: institution == 'NUS' ? 'inst001' :
            institution == 'NTU'? 'inst002' :
            institution == 'SMU'? 'inst003' :
            institution == 'SIM'? 'inst004' :
            institution == 'SUTD'? 'inst005': 'insterr',
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
