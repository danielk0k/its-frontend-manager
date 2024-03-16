import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    console.log("here")
    const course_name = req.nextUrl.searchParams.get("courseId");
    const user_id = req.nextUrl.searchParams.get("userId")

    if (!course_name || !user_id) {
      throw new Error("Course ID or User ID not provided.");
    }

    const user = await prisma.user.findUnique({
      where: {
          id: user_id
      }
    })

    if (!user) {
      throw new Error("User not found.");
    }
    
    const course = await prisma.course.findUnique({
      where: {
        id: user?.school_id + "_" + course_name.toUpperCase(),
      },
      include: {
          questions: true, 
      },
    });

    if (!course) {
      throw new Error("Course not found.");
    }
    
    return new NextResponse(
      JSON.stringify({
        status: "success",
        message: "Questions retrieved successfully.",
        questions: course.questions,
      }),
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Questions not found.",
      }),
    );
  }
}
