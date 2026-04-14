export type Result = 'PLAYER' | 'BANKER' | 'TIE';

export function analyzeRoads(results: Result[]) {
  const decisiveResults = results.filter(
    (result): result is Exclude<Result, 'TIE'> => result !== 'TIE',
  );

  if (decisiveResults.length < 3) {
    return {
      confidence: 0,
      tieCount: results.length - decisiveResults.length,
    };
  }

  const last = decisiveResults[decisiveResults.length - 1];

  let streak = 0;
  for (let i = decisiveResults.length - 1; i >= 0; i--) {
    if (decisiveResults[i] === last) streak++;
    else break;
  }

  let changes = 0;
  for (let i = 1; i < decisiveResults.length; i++) {
    if (decisiveResults[i] !== decisiveResults[i - 1]) changes++;
  }

  let confidence = 0;
  if (streak >= 3) confidence++;
  if (changes / decisiveResults.length < 0.6) confidence++;

  return {
    confidence,
    tieCount: results.length - decisiveResults.length,
  };
}
