import { prisma } from "@/src/lib/prisma";

export async function analyzeSession(sessionId: string) {
  const participants = await prisma.participant.findMany({
    where: { sessionId },
  });

  if (!participants.length) return null;

  // 1️⃣ Calculate average budget
  const totalBudget = participants.reduce(
    (sum, p) => sum + (p.budget || 0),
    0
  );

  const averageBudget = totalBudget / participants.length;

  // 2️⃣ Merge preferences
  const preferenceMap: Record<string, number> = {};

  participants.forEach((p) => {
    p.preferences.forEach((pref: string) => {
      preferenceMap[pref] = (preferenceMap[pref] || 0) + 1;
    });
  });

  // Sort by most common preferences
  const topPreferences = Object.entries(preferenceMap)
    .sort((a, b) => b[1] - a[1])
    .map(([pref]) => pref);

  return {
    averageBudget,
    topPreferences,
  };
}