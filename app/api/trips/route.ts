import { NextResponse } from "next/server";
import type { Trip } from "@/src/types/trip";

// Temporary in-memory storage
let trips: Trip[] = [];

export async function GET() {
  return NextResponse.json(trips);
}

export async function POST(request: Request) {
  const newTrip = await request.json();
  trips.push(newTrip);
  return NextResponse.json(newTrip, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  trips = trips.filter((trip) => trip.id !== id);
  return NextResponse.json({ message: "Trip deleted" });
}