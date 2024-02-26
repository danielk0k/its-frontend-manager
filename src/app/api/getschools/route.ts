import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';

export async function GET(req: Request) {
  try {
    const school_ids = await prisma.school.findMany()

    return NextResponse.json({
      school_ids
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
