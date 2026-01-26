import { ModelMemory, bucketEV } from "./modelMemory";

export function aiAdvisor(
  ev: number,
  recent: ("P" | "B")[],
  memory: ModelMemory
) {
  if (memory.totalHands < 200) {
    return { allow: false, reason: "Not enough historical data", confidence: 0 };
  }

  if (Math.abs(ev) < 0.25) {
    return { allow: false, reason: "EV too weak", confidence: 40 };
  }

  const bucket = bucketEV(Math.abs(ev));
  const data = memory.evBuckets[bucket];
  const winRate = data.bets ? data.wins / data.bets : 0.5;

  if (ev > 0 && winRate < 0.495) {
    return {
      allow: false,
      reason: "This EV range underperforms historically",
      confidence: 45,
    };
  }

  if (recent.length >= 10) {
    let flips = 0;
    for (let i = 1; i < recent.length; i++) {
      if (recent[i] !== recent[i - 1]) flips++;
    }
    if (flips / recent.length > 0.7) {
      return {
        allow: false,
        reason: "High volatility / choppy shoe",
        confidence: 50,
      };
    }
  }

  const confidence = Math.min(90, Math.round(60 + Math.abs(ev) * 20));

  return { allow: true, confidence };
}
