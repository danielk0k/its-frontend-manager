"use server";

import prisma from "@/lib/prisma";

export async function setSubmissionGrade({ 
  submission_id, 
  grade 
}: { 
  submission_id: string, 
  grade: number
}) {
    try {
      if (!Number.isInteger(grade)) {
        console.error("Invalid grade format");
        return null;
      }

      if (grade < 0 || grade > 100) {
        console.error("Grade awarded is out of range");
        return null;
      }

      const submission = await prisma.submission.update({
        where: {
          id: submission_id,
        },
        data: {
            grade: grade,
        },
      })
  
      if (!submission) {
        return null;
      }

      return submission;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  