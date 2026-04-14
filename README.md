# Blackjack Decision Assistant

A production-style **Next.js App Router** project for blackjack strategy assistance.

## Features

- TypeScript + Tailwind CSS
- Vercel-ready Next.js app (single process, no separate backend)
- Mode selector with dedicated rule profiles:
  - Regular Blackjack
  - Infinity Blackjack
- Modular architecture:
  - `lib/blackjack/rules.ts` for mode rules
  - `lib/blackjack/handEvaluator.ts` for hand value logic
  - `lib/blackjack/strategy.ts` for decision model
  - `lib/blackjack/advisor.ts` for user-facing advice assembly
  - `components/blackjack/*` for UI building blocks
- Assistant-style output (advice + rationale), not autoplay

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```
