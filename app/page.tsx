'use client';

import { useState } from 'react';
import CardGrid from '../components/CardGrid';
import ConfidenceMeter from '../components/ConfidenceMeter';

type Card = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
type Result = 'Player' | 'Banker';

export default function Home() {
  /* =========================
     CURRENT HAND (INPUT ONLY)
     ========================= */
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [bankerCards, setBankerCards] = useState<Card[]>([]);

  /* =========================
     SESSION MEMORY
     ========================= */
  const [results, setResults] = useState<Result[]>([]);
  const [sessionHands, setSessionHands] = useState(0);

  /* =========================
     ADVISOR OUTPUT
     ========================= */
  const [recommendation, setRecommendation] =
    useState<'Player' | 'Banker' | 'DO NOT PLAY'>('DO NOT PLAY');

  const [ev, setEv] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [advisorReason, setAdvisorReason] =
    useState('Not enough historical data');

  /* =========================
     DISCIPLINE METRICS
     ========================= */
  const [skipCount, setSkipCount] = useState(0);

  /* =========================
     HELPERS
     ========================= */
  function baccaratValue(card: Card) {
    if (card === 'A') return 1;
    if (['10', 'J', 'Q', 'K'].includes(card)) return 0;
    return parseInt(card, 10);
  }

  function handTotal(cards: Card[]) {
    return cards.reduce((sum, c) => sum + baccaratValue(c), 0) % 10;
  }

  function evaluateHand(): Result {
    const p = handTotal(playerCards);
    const b = handTotal(bankerCards);
    return p >= b ? 'Player' : 'Banker';
  }

  /* =========================
     DONE = RECORD HAND ONLY
     ========================= */
  function handleDone() {
    if (playerCards.length === 0 || bankerCards.length === 0) return;

    const outcome = evaluateHand();

    // Record outcome
    setResults(prev => [...prev, outcome]);
    setSessionHands(prev => prev + 1);

    const totalHands = results.length + 1;

    // -------------------------
    // ADVISOR LOGIC (HONEST)
    // -------------------------
    if (totalHands < 12) {
      setRecommendation('DO NOT PLAY');
      setAdvisorReason('Not enough historical data');
      setConfidence(0);
      setEv(0);
      setSkipCount(prev => prev + 1);
    } else {
      const allResults = [...results, outcome];
      const playerWins = allResults.filter(r => r === 'Player').length;
      const bankerWins = allResults.length - playerWins;

      const playerRate = playerWins / allResults.length;
      const bankerRate = bankerWins / allResults.length;

      const playerEV = playerRate - bankerRate;
      const bankerEV = bankerRate * 0.95 - playerRate;

      if (playerEV > bankerEV && playerEV > 0) {
        setRecommendation('Player');
        setEv(Number((playerEV * 100).toFixed(2)));
      } else if (bankerEV > 0) {
        setRecommendation('Banker');
        setEv(Number((bankerEV * 100).toFixed(2)));
      } else {
        setRecommendation('DO NOT PLAY');
        setAdvisorReason('Negative EV zone');
        setSkipCount(prev => prev + 1);
      }

      const conf =
        Math.min(allResults.length / 300, 1) * 30 +
        Math.min(Math.abs(Math.max(playerEV, bankerEV)) * 100, 40);

      setConfidence(Math.round(conf));
    }

    // ✅ AUTO-RESET FOR NEXT HAND
    setPlayerCards([]);
    setBankerCards([]);
  }

  function resetShoe() {
    setResults([]);
    setSessionHands(0);
    setRecommendation('DO NOT PLAY');
    setConfidence(0);
    setEv(0);
    setAdvisorReason('New shoe');
    setSkipCount(0);
    setPlayerCards([]);
    setBankerCards([]);
  }

  /* =========================
     UI
     ========================= */
  return (
    <main className="min-h-screen bg-green-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Baccarat Decision Assistant
      </h1>

      <div className="grid grid-cols-3 gap-6 items-start">

        {/* PLAYER */}
        <div className="bg-green-800 p-4 rounded">
          <h2 className="text-xl mb-2">Player Cards</h2>

          <CardGrid
            disabled={false}
            onSelect={(c: Card) =>
              setPlayerCards(p => [...p, c])
            }
          />

          <div className="mt-2 text-sm">
            {playerCards.map((c, i) => (
              <span
                key={i}
                className="mr-1 px-2 py-1 bg-white text-black rounded"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* CENTER */}
        <div className="bg-black p-4 rounded text-center">
          <div className="text-sm mb-1">
            Best statistical next bet
          </div>

          <div className="text-3xl font-bold text-yellow-400">
            {recommendation}
          </div>

          {recommendation !== 'DO NOT PLAY' && (
            <div className="text-sm mt-1">EV: {ev}%</div>
          )}

          {recommendation === 'DO NOT PLAY' && (
            <div className="text-red-400 text-sm mt-1">
              🚫 {advisorReason}
            </div>
          )}

          <ConfidenceMeter value={confidence} />

          <button
            onClick={handleDone}
            className="mt-4 w-full bg-yellow-400 text-black font-bold py-3 rounded text-lg"
          >
            DONE
          </button>

          <button
            onClick={resetShoe}
            className="mt-2 text-sm text-red-300 underline"
          >
            Reset Shoe
          </button>

          <div className="mt-3 text-xs">
            Session hands recorded: {sessionHands}
          </div>

          <div className="text-xs">
            Skipped bad spots: {skipCount}
          </div>
        </div>

        {/* BANKER */}
        <div className="bg-green-800 p-4 rounded">
          <h2 className="text-xl mb-2">Banker Cards</h2>

          <CardGrid
            disabled={false}
            onSelect={(c: Card) =>
              setBankerCards(b => [...b, c])
            }
          />

          <div className="mt-2 text-sm">
            {bankerCards.map((c, i) => (
              <span
                key={i}
                className="mr-1 px-2 py-1 bg-white text-black rounded"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
