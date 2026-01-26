export type EVBucket = "0-0.25" | "0.25-0.5" | "0.5-1" | "1+";

export interface ModelMemory {
  totalHands: number;
  evBuckets: Record<EVBucket, { bets: number; wins: number }>;
}

const KEY = "baccarat_model_memory";

const DEFAULT_MEMORY: ModelMemory = {
  totalHands: 0,
  evBuckets: {
    "0-0.25": { bets: 0, wins: 0 },
    "0.25-0.5": { bets: 0, wins: 0 },
    "0.5-1": { bets: 0, wins: 0 },
    "1+": { bets: 0, wins: 0 },
  },
};

export function loadMemory(): ModelMemory {
  if (typeof window === "undefined") return DEFAULT_MEMORY;
  return JSON.parse(localStorage.getItem(KEY) || JSON.stringify(DEFAULT_MEMORY));
}

export function saveMemory(memory: ModelMemory) {
  localStorage.setItem(KEY, JSON.stringify(memory));
}

export function bucketEV(ev: number): EVBucket {
  if (ev < 0.25) return "0-0.25";
  if (ev < 0.5) return "0.25-0.5";
  if (ev < 1) return "0.5-1";
  return "1+";
}
