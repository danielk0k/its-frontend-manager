"use server";

import prisma from "@/lib/prisma";

export async function getMySubmissions({ 
  question_id, 
  user_email 
}: { 
  question_id: string, 
  user_email: string 
}) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: user_email,
        },
        include: {
          submissions: true,
        }
      })
  
      if (!user) {
        return null;
      }

      const questionSubmissions = user.submissions.filter(submission => 
        submission.question_id === question_id
      )

      return questionSubmissions;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  