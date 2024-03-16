import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { user_id, course_name , title, description, language, reference_program } = 
      (await req.json()) as {
        user_id: string
        course_name: string;
        title: string;
        description: string;
        language: string;
        reference_program: string;
      };

      const user = await prisma.user.findUnique({
        where: {
            id: user_id
        }
      })
      
      const course = await prisma.course.findUnique({
        where: {
          id: user?.school_id + "_" + course_name.toUpperCase(),
        },
        include: {
            questions: true, 
        },
      });

  
      const question = await prisma.question.create({
        data: {
          title,
          description,
          language,
          reference_program,
          course: { connect: { id: course?.id } },
        }
      });


      await prisma.course.update({
        where: {
          id: course?.id,
        },
        data: {
          questions: {
            connect: { id: question.id }
          },
        },
      });
  
      return new NextResponse(
        JSON.stringify({
          status: 'success',
          message: 'Question created successfully.',
          question,
        }),
      );
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({
          status: 'error',
          message: error.message,
        }),
      );
    }
}
