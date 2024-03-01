import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Creates a new question
 * @param request
 * @returns the new question
 * Retrieve question id using data.id
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const { reference_program_id, ...content } = await request.json();

  if (!content) {
    return NextResponse.json(
      { body: "Expected question content" },
      { status: 500 }
    );
  }

  if (!content.title) {
    return NextResponse.json(
      { body: "Expected question title in content." },
      { status: 500 }
    );
  }

  if (!reference_program_id) {
    return NextResponse.json(
      {
        body: "Expected reference program id. Please upload the reference program first.",
      },
      { status: 500 }
    );
  }

  const data = await prisma.question.create({
    data: { content, reference_program_id: reference_program_id },
  });

  return NextResponse.json(data, { status: 200 });
}
