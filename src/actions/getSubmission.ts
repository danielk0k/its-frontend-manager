"use server";

import prisma from "@/lib/prisma";

export async function getSubmission({ submission_id }: { submission_id: string }) {
    try {
      const submission = await prisma.submission.findUnique({
        where: {
          id: submission_id,
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
  