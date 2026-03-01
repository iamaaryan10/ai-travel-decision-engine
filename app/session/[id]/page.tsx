"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Recommendation {
  name: string;
  tags: string[];
  averageCost: number;
  score: number;
}

interface FinalizeResult {
  averageBudget: number | null;
  topPreferences: string[];
  recommendations: Recommendation[];
}

export default function SessionPage() {
  const params = useParams();
  const id = params.id as string;

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [budget, setBudget] = useState("");

  const [result, setResult] = useState<FinalizeResult | null>(null);
  const [finalizing, setFinalizing] = useState(false);

  const preferenceOptions = [
    "beach",
    "mountains",
    "nightlife",
    "adventure",
    "luxury",
    "culture",
  ];

  // Fetch session
  const fetchSession = async () => {
    try {
      const res = await fetch(`/api/sessions/${id}`);
      const data = await res.json();
      setSession(data);
    } catch (err) {
      console.error("Error fetching session:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  // Handle Join
  const handleJoin = async () => {
    try {
      const res = await fetch(`/api/sessions/${id}/participants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          preferences,
          budget: budget !== "" ? Number(budget) : null,
        }),
      });

      if (!res.ok) throw new Error("Join failed");

      setName("");
      setBudget("");
      setPreferences([]);
      fetchSession();
    } catch (err) {
      console.error(err);
      alert("Join failed");
    }
  };

  // Handle Finalize
  const handleFinalize = async () => {
  setFinalizing(true);

  try {
    const res = await fetch(`/api/sessions/${id}/finalize`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Failed to finalize");

    const data = await res.json();

    console.log("FINALIZE DATA:", data); // 👈 ADD THIS
    setResult(data);

    setTimeout(() => {
      window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    }, 100);

  } catch (err) {
    console.error(err);
  } finally {
    setFinalizing(false);
  }
 };

  if (loading) return <main className="p-10 bg-black text-white">Loading...</main>;
  if (!session) return <main className="p-10 bg-black text-red-500">Session not found</main>;

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold">{session.title}</h1>
      <p className="text-gray-400 mb-6">Host: {session.hostName}</p>

      {/* Participants */}
      <h2 className="text-xl font-semibold mb-3">Participants</h2>

      {session.participants.length === 0 ? (
        <p className="text-gray-500 mb-6">No participants yet</p>
      ) : (
        <div className="space-y-2 mb-8">
          {session.participants.map((p: any) => (
            <div key={p.id} className="bg-gray-800 p-3 rounded">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-400">
                Preferences: {p.preferences.join(", ") || "None"}
              </div>
              <div className="text-sm text-gray-400">
                Budget: ₹{p.budget ?? "Not specified"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Join Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Join Session</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-800 p-2 rounded w-64 mb-4"
        />

        <div className="mb-4">
          <p className="mb-2">Preferences:</p>
          {preferenceOptions.map((pref) => (
            <label key={pref} className="block">
              <input
                type="checkbox"
                value={pref}
                checked={preferences.includes(pref)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPreferences([...preferences, pref]);
                  } else {
                    setPreferences(preferences.filter((p) => p !== pref));
                  }
                }}
                className="mr-2"
              />
              {pref}
            </label>
          ))}
        </div>

        <div className="mb-4">
          <p>Budget (INR):</p>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="bg-gray-800 p-2 rounded w-64"
          />
        </div>

        <button
          onClick={handleJoin}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Join
        </button>
      </div>

      {/* Finalize Button */}
      <button
        onClick={handleFinalize}
        disabled={finalizing}
        className="px-6 py-3 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {finalizing ? "Analyzing..." : "Finalize Decision"}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-10 bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            🎯 Recommendations
          </h2>

          <p>
            <strong>Average Budget:</strong> ₹{result.averageBudget}
          </p>

          <p className="mb-4">
            <strong>Top Preferences:</strong>{" "}
            {result.topPreferences.join(", ")}
          </p>

          {result.recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded mb-3 border border-gray-700"
            >
              <h3 className="text-lg font-semibold">
                {index === 0 ? "🏆 Best Match: " : ""}
                {rec.name}
              </h3>
              <p>Tags: {rec.tags.join(", ")}</p>
              <p>Average Cost: ₹{rec.averageCost}</p>
              <p className="text-green-400">
                Score: {rec.score.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}