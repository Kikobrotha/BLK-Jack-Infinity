export type Result = 'PLAYER' | 'BANKER' | 'TIE';

export function analyzeRoads(results: Result[]) {
  if (results.length < 3) return { confidence: 0 };

  const last = results[results.length - 1];

  let streak = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i] === last) streak++;
    else break;
  }

  let changes = 0;
  for (let i = 1; i < results.length; i++) {
    if (results[i] !== results[i - 1]) changes++;
  }

  let confidence = 0;
  if (streak >= 3) confidence++;
  if (changes / results.length < 0.6) confidence++;

  return { confidence };
}
