import { NextResponse } from "next/server";
import { analyzeSession } from "@/src/services/decisionEngine";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = await analyzeSession(id);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Finalize error:", error);
    return NextResponse.json(
      { error: "Failed to finalize session" },
      { status: 500 }
    );
  }
}