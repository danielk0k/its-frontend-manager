import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Creates a new question
 * @param request
 * @returns the new question
 * Retrieve question id using data.id
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { reference_program, courseId, ...content } = await request.json();

    if (!content) {
      throw new Error("Expected question content.");
    }

    if (!courseId) {
      throw new Error("Expected course id.");
    }

    if (!reference_program) {
      throw new Error(
        "Expected reference program id. Please upload the reference program first."
      );
    }

    const question = await prisma.question.create({
      data: {
        ...content,
        reference_program: reference_program,
        course: {
          connect: { id: courseId },
        },
      },
    });

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        questions: true,
      },
    });

    if (!course) {
      throw new Error("Unable to find course")
    }

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        questions: {
          set: [...course.questions, question],
        },
      },
    });

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ body: error.message }, { status: 500 });
  }
}
