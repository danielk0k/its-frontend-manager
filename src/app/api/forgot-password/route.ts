import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as {
      email: string;

    };

    const user = await prisma.user.findUnique({
      where: {
          email: email.toLowerCase()
      }
    })

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          status: 'error',
          message: 'User not found.',
        }),
        { status: 500 }
      );
    } else {
      // user exists 
      return NextResponse.json({
        reset: {
          email: user.email,
        }
      });
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
