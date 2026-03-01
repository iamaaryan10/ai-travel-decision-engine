export interface Destination {
  name: string;
  tags: string[];
  averageCost: number; // approximate cost per person in INR
}

export const destinations: Destination[] = [
  {
    name: "Goa",
    tags: ["beach", "nightlife", "luxury"],
    averageCost: 15000,
  },
  {
    name: "Manali",
    tags: ["mountains", "adventure", "budget"],
    averageCost: 12000,
  },
  {
    name: "Udaipur",
    tags: ["luxury", "culture"],
    averageCost: 18000,
  },
  {
    name: "Rishikesh",
    tags: ["adventure", "budget"],
    averageCost: 10000,
  },
  {
    name: "Jaipur",
    tags: ["culture", "budget"],
    averageCost: 14000,
  },
];