import { prisma } from "@/src/lib/prisma";
import { destinations } from "@/src/data/destinations";

export async function analyzeSession(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { participants: true },
  });

  if (!session) {
    throw new Error("Session not found");
  }

  const participants = session.participants;

  if (participants.length === 0) {
    throw new Error("No participants in session");
  }

  // 1️⃣ Collect all preferences
  const allPreferences = participants.flatMap((p) => p.preferences);

  // Count frequency
  const preferenceCount: Record<string, number> = {};
  allPreferences.forEach((pref) => {
    preferenceCount[pref] = (preferenceCount[pref] || 0) + 1;
  });

  // 2️⃣ Calculate average budget
  const budgets = participants
    .map((p) => p.budget)
    .filter((b): b is number => b !== null && b !== undefined);

  const averageBudget =
    budgets.length > 0
      ? budgets.reduce((a, b) => a + b, 0) / budgets.length
      : null;

  // 3️⃣ Score destinations
  const scoredDestinations = destinations.map((dest) => {
    let score = 0;

    // Preference match scoring
    dest.tags.forEach((tag) => {
      if (preferenceCount[tag]) {
        score += preferenceCount[tag] * 2; // weight = 2
      }
    });

    // Budget compatibility scoring
    if (averageBudget !== null) {
      const diff = Math.abs(dest.averageCost - averageBudget);
      score -= diff / 5000; // penalize large budget mismatch
    }

    return {
      ...dest,
      score,
    };
  });

  // 4️⃣ Sort descending by score
  scoredDestinations.sort((a, b) => b.score - a.score);

  return {
    averageBudget,
    topPreferences: Object.entries(preferenceCount)
      .sort((a, b) => b[1] - a[1])
      .map(([pref]) => pref),
    recommendations: scoredDestinations.slice(0, 3),
  };
}