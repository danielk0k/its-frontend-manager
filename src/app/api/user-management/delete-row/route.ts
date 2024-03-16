import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const { email } = (await req.json()) as {
      email: string;
    };

    // Delete the user based on the email
    const deletedUser = await prisma.user.delete({
      where: {
        email: email,
      },
    });

    return NextResponse.json({
      deleted: {
        email: deletedUser.email,
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
