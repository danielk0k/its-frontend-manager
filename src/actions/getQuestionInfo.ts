"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUserProps } from "./getUserProps";

export async function getQuestionInfo({ questionId, courseId }: { questionId: string; courseId: string }) {
  try {
    const user = await getUserProps()

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        course: true,
        submissions: true,
      },
    });

    if (!question || question.courseId !== user.props.user.school_id + "_" + courseId) {
      redirect(`/courses/${courseId}`);
    }
    return question;
  } catch (error) {
    console.error(error);
    return null;
  }
}
