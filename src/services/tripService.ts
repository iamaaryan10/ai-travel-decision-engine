import type { Trip } from "@/src/types/trip";

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    const res = await fetch("/api/trips");
    return res.json();
  },

  async addTrip(trip: Trip): Promise<Trip> {
    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip),
    });

    return res.json();
  },

  async deleteTrip(id: string): Promise<void> {
    await fetch("/api/trips", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  },
};