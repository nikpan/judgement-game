export const enum Suit {
  Hearts = 'H',
  Spades = 'S',
  Clubs = 'C',
  Diamonds = 'D'
}
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export class Card {
  public suit: Suit;
  public rank: Rank;
}

export interface Hand {
  cards: Card[];
}