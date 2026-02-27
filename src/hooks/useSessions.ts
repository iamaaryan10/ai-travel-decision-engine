import { useState, useEffect } from "react";
import type { DecisionSession } from "@/src/types/session";
import { sessionService } from "@/src/services/sessionService";

export function useSessions() {
  const [sessions, setSessions] = useState<DecisionSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getSessions();
      setSessions(data);
    } catch {
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const createSession = async (session: DecisionSession) => {
    await sessionService.createSession(session);
    await loadSessions();
  };

  return { sessions, createSession, loading, error };
}