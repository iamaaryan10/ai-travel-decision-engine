"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Participant = {
  id: string;
  name: string;
  preferences: string[];
  budget?: number | null;
};

type Session = {
  id: string;
  title: string;
  hostName: string;
  createdAt: string;
  participants: Participant[];
};

export default function SessionPage() {
  const params = useParams();
  const id = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [joining, setJoining] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  // 🔥 Fetch session
  const fetchSession = async () => {
    try {
      const res = await fetch(`/api/sessions/${id}`);
      if (!res.ok) throw new Error("Failed to fetch session");

      const data = await res.json();
      setSession(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load session");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSession();
  }, [id]);

  // Toggle preference
  const togglePreference = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref)
        ? prev.filter((p) => p !== pref)
        : [...prev, pref]
    );
  };

  // Join session
  const handleJoin = async () => {
    if (!name.trim()) return;

    setJoining(true);

    try {
      const res = await fetch(`/api/sessions/${id}/participants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          preferences: selectedPreferences,
          budget: budget ? Number(budget) : null,
        }),
      });

      if (!res.ok) throw new Error("Join failed");

      setName("");
      setBudget("");
      setSelectedPreferences([]);

      await fetchSession();
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Loading...
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen bg-black text-red-500 p-10">
        {error || "Session not found"}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
      <p className="text-gray-400">Host: {session.hostName}</p>
      <p className="text-gray-500 mb-6">
        Created: {new Date(session.createdAt).toLocaleString()}
      </p>

      {/* Participants Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Participants</h2>

        {session.participants.length === 0 ? (
          <p className="text-gray-500">No participants yet</p>
        ) : (
          <div className="space-y-4">
            {session.participants.map((p) => (
              <div key={p.id} className="bg-gray-800 p-4 rounded">
                <div className="font-medium text-lg">{p.name}</div>

                <div className="text-sm text-gray-400 mt-1">
                  {p.preferences.length > 0
                    ? p.preferences.join(", ")
                    : "No preferences selected"}
                </div>

                {p.budget && (
                  <div className="text-sm text-green-400 mt-1">
                    Budget: ₹{p.budget.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Join Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Join Session</h2>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 bg-gray-800 rounded w-64 mb-4"
        />

        {/* Preferences */}
        <div className="mb-4 space-y-2">
          {[
            "beach",
            "mountains",
            "nightlife",
            "adventure",
            "luxury",
            "culture",
          ].map((pref) => (
            <label key={pref} className="block cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPreferences.includes(pref)}
                onChange={() => togglePreference(pref)}
                className="mr-2"
              />
              {pref}
            </label>
          ))}
        </div>

        {/* Budget Input */}
        <div className="mb-6">
          <label className="block mb-1 text-gray-400">
            Your Budget (INR)
          </label>
          <input
            type="number"
            placeholder="Enter amount in INR"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="p-3 bg-gray-800 rounded w-64"
          />
        </div>

        <button
          onClick={handleJoin}
          disabled={joining}
          className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {joining ? "Joining..." : "Join"}
        </button>
      </div>
    </main>
  );
}