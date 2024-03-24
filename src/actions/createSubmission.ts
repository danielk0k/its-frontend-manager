"use server";

import prisma from "@/lib/prisma";

export async function createSubmission({ 
  user_email, 
  question_id, 
  submitted_program 
}: { 
  user_email: string, 
  question_id: string, 
  submitted_program: string 
}) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: user_email,
        },
      });
  
      if (!user) {
        return null;
      }

      const question = await prisma.question.findUnique({
        where: {
          id: question_id,
        },
        include: {
            submissions: true,
        },
      });

      const newSubmission = await prisma.submission.create({
        data: {
          user_id: user.id,
          question_id: question_id,
          submitted_program: submitted_program,
        },
      });
  
      const existingSubmissions = question?.submissions || [];
      const updatedSubmissions = [...existingSubmissions, newSubmission];
  
      await prisma.question.update({
        where: {
          id: question?.id,
        },
        data: {
          submissions: {
            set: updatedSubmissions
          }
        },
      });

      return newSubmission;

    } catch (error) {
      console.error(error);
      return null;
    }
  }
  