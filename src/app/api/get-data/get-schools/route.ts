import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// example usage:
// const res = await fetch(process.env.URL + '/api/get-data/get-schools', {
//     method: 'GET',
// });
// const data = await res.json();
// const parsed: School[] = data.school_ids.map(school => ({
//     id: school.id,
//     name: school.name,
// }));
// console.log(parsed);

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
