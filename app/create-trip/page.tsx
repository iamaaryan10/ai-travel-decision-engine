"use client";

import { useState } from "react";
import { useTrips } from "@/src/hooks/useTrips";
import type { Trip } from "@/src/types/trip";

export default function CreateTripPage() {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [budgetRange, setBudgetRange] = useState("");

  const { trips, addTrip, deleteTrip, loading, error } = useTrips();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTrip: Trip = {
      id: crypto.randomUUID(),
      name,
      destination,
      budgetRange,
      createdAt: new Date(),
    };

    addTrip(newTrip);

    // Reset form
    setName("");
    setDestination("");
    setBudgetRange("");
  };

  if (loading) {
   return (
     <main className="min-h-screen bg-black text-white flex items-center justify-center">
       <p>Loading trips...</p>
     </main>
   );
  }

  if (error) {
   return (
    <main className="min-h-screen bg-black text-red-500 flex items-center justify-center">
      <p>{error}</p>
    </main>
   );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-16 px-6">
      <h1 className="text-4xl font-bold mb-10">Create a New Trip</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4"
      >
        <input
          type="text"
          placeholder="Trip Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          required
        />

        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          required
        />

        <input
          type="number"
          placeholder="Budget Range (INR)"
          value={budgetRange}
          onChange={(e) => setBudgetRange(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-white text-black rounded font-semibold hover:opacity-90 transition"
        >
          Create
        </button>
      </form>

      {trips.length > 0 && (
        <div className="mt-12 w-full max-w-md space-y-4">
          <h2 className="text-2xl font-semibold">Created Trips</h2>

          {trips.map((trip) => (
            <div
                key={trip.id}
                className="p-4 bg-gray-800 rounded border border-gray-700 flex justify-between items-start"
                >
                <div>
                    <p className="font-bold">{trip.name}</p>
                    <p className="text-sm text-gray-400">
                    {trip.destination}
                    </p>
                    <p className="text-sm text-gray-400">
                    Budget: ₹{trip.budgetRange}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                    Created: {trip.createdAt.toLocaleString()}
                    </p>
                </div>

                <button
                    onClick={() => deleteTrip(trip.id)}
                    className="text-red-400 text-sm hover:text-red-500"
                >
                    Delete
                </button>
                </div>
        ))}
        </div>
      )}
    </main>
  );
}