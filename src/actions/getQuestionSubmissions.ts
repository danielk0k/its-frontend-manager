"use server";

import prisma from "@/lib/prisma";

export async function getQuestionSubmissions({ question_id }: { question_id: string }) {
    try {
      const question = await prisma.question.findUnique({
        where: {
          id: question_id,
        },
        include: {
          submissions: true,
        }
      })
  
      if (!question) {
        return null;
      }

      return question.submissions;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  