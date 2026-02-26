import { useState, useEffect } from "react";
import type { Trip } from "@/src/types/trip";
import { tripService } from "@/src/services/tripService";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getTrips();
      setTrips(data);
    } catch {
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const addTrip = async (trip: Trip) => {
    await tripService.addTrip(trip);
    await loadTrips();
  };

  const deleteTrip = async (id: string) => {
    await tripService.deleteTrip(id);
    await loadTrips();
  };

  return { trips, addTrip, deleteTrip, loading, error };
}