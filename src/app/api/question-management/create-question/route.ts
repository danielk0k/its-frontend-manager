import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

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
          id: user?.school_id + "_" + course_name,
        },
        include: {
            questions: true, 
        },
      });

      const newQuestion = await prisma.question.create({
        data: {
          title,
          description,
          language,
          reference_program,
          course: {
            connect: { id: course?.id },
          },
        },
      });
  
      const existingQuestions = course?.questions || [];
      const updatedQuestions = [...existingQuestions, newQuestion];
  
      await prisma.course.update({
        where: {
          id: course?.id,
        },
        data: {
          questions: updatedQuestions,
        },
      });

      return NextResponse.json({
        status: 'success',
        newQuestion,
      });
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({
          status: 'error',
          message: error.message,
        }),
      );
    }
}
