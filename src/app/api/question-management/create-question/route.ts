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
          id: user?.school_id + "_" + course_name,
        },
        include: {
            questions: true, 
        },
      });
  
      if (!course) {
        return new NextResponse(
          JSON.stringify({
            status: 'error',
            message: 'Course not found.',
          }),
          { status: 404 }
        );
      }

  
      if (!user || user.role !== 'TEACHER' || user.id !== course.creator_id) {

        return new NextResponse(
          JSON.stringify({
            status: 'error',
            message: 'Unauthorized. Only the teacher who created the course can create a question.',
          }),
          { status: 403 }
        );
      }

      const question = await prisma.question.create({
        data: {
          title,
          description,
          language,
          reference_program,
          course: {
            connect: {
              id: course.id,
            },
          },
        },
      });

      await prisma.course.update({
        where: {
          id: course.id,
        },
        data: {
          questions: {
            push: question,
          },
        },
      });
  
      return new NextResponse(
        JSON.stringify({
          status: 'success',
          message: 'Question created successfully.',
          question,
        }),
        { status: 201 }
      );
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
