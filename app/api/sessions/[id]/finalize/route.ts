import { NextResponse } from "next/server";
import { analyzeSession } from "@/src/services/decisionEngine";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // 1️⃣ Get session analysis from DB
    const result = await analyzeSession(id);

    if (!result) {
      return NextResponse.json(
        { error: "No analysis result found" },
        { status: 404 }
      );
    }

    // 2️⃣ Call Python ML service
    const mlResponse = await fetch("http://localhost:8000/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        averageBudget: result.averageBudget,
        topPreferences: result.topPreferences,
      }),
    });

    if (!mlResponse.ok) {
      throw new Error("ML service failed");
    }

    const mlData = await mlResponse.json();

    return NextResponse.json(mlData);

  } catch (error) {
    console.error("Finalize error:", error);
    return NextResponse.json(
      { error: "Failed to finalize session" },
      { status: 500 }
    );
  }
}