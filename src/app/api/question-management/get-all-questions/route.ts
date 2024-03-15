  import { NextResponse, NextRequest } from "next/server";
  import prisma from "@/lib/prisma";

  export async function GET(req: NextRequest) {
    try {
      const course_name = req.nextUrl.searchParams.get("course_name");
      
      const course = await prisma.course.findUnique({
        where: {
          code: course_name
        },
        include: {
          questions: true,
        },
      });

      if (!course) {
        return new NextResponse(
          JSON.stringify({
            status: "error",
            message: "Course not found.",
          }),
        );
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
          message: error.message,
        }),
      );
    }
  }
