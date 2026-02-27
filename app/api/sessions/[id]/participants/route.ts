import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ MUST await params in Next 15/16
    const { id } = await context.params;

    const body = (await request.json()) as {
      name: string;
      preferences?: string[];
      budget?: number;
    };

    if (!body.name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const participant = await prisma.participant.create({
      data: {
        name: body.name,
        preferences: body.preferences ?? [],
        budget: body.budget ?? null,
        sessionId: id,
      },
    });

    return NextResponse.json(participant, { status: 201 });

  } catch (error) {
    console.error("Join error:", error);
    return NextResponse.json(
      { error: "Failed to join session" },
      { status: 500 }
    );
  }
}