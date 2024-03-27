"use server";

import prisma from "@/lib/prisma";
import { Submission } from "@prisma/client";

export type UserSubmission = Submission & {email: string, role: string, school_id: string}

export async function getQuestionSubmissions({ question_id }: { question_id: string }) {
    try {
      const question = await prisma.question.findUnique({
        where: {
          id: question_id,
        },
        include: {
          submissions: {include: {user: {select: {email: true, role: true, school_id: true,}}}}, 
        }
      })
  
      if (!question) {
        return null;
      }

      let output: UserSubmission[] = [];

      question.submissions.forEach(submission => {
        output.push({...submission, email: submission.user.email!, role: submission.user.role, school_id: submission.user.school_id})
      });

      return output;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  