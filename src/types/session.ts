export type SessionStatus = "collecting" | "voting" | "finalized";

export interface Participant {
  id: string;
  name: string;
  preferences: string[];
}

export interface DecisionSession {
  id: string;
  title: string;
  hostName: string;
  status: "collecting" | "closed";
  createdAt: Date;
  participants: Participant[];
}