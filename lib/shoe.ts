export type Card =
  | 'A' | '2' | '3' | '4'
  | '5' | '6' | '7' | '8'
  | '9' | '10' | 'J' | 'Q' | 'K';

export type Shoe = Record<Card, number>;

export function createShoe(decks = 8): Shoe {
  const cards: Card[] = [
    'A','2','3','4','5','6','7','8',
    '9','10','J','Q','K',
  ];
  return Object.fromEntries(
    cards.map(c => [c, 4 * decks])
  ) as Shoe;
}
