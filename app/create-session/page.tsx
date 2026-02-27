"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateSessionPage() {
  const [title, setTitle] = useState("");
  const [hostName, setHostName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, hostName }),
      });

      if (!res.ok) throw new Error("Failed to create session");

      const createdSession = await res.json();

      router.push(`/session/${createdSession.id}`);
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">
        Create Decision Session
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Session Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
          required
        />

        <input
          type="text"
          placeholder="Your Name (Host)"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
          required
        />

        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded"
        >
          Create Session
        </button>
      </form>
    </main>
  );
}