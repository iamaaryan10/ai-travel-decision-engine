import type { DecisionSession } from "@/src/types/session";

export const sessionService = {
  getSessions: async () => {
    const res = await fetch("/api/sessions");
    return res.json();
  },

  createSession: async (session: DecisionSession) => {
    await fetch("/api/sessions", {
      method: "POST",
      body: JSON.stringify(session),
    });
  },

  getSessionById: async (id: string) => {
    const res = await fetch(`/api/sessions/${id}`);
    if (!res.ok) return null;
    return res.json();
  },
};