import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { body: "Intelligent Tutoring System (ITS) Manager" },
    { status: 200 }
  );
}
