export const enum Suit {
  Hearts = 'H',
  Spades = 'S',
  Clubs = 'C',
  Diamonds = 'D'
}
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface ICard {
  suit: Suit;
  rank: Rank;
}

export interface Hand {
  cards: ICard[];
}

export function Winner (firstCard:ICard, secondCard:ICard, trump:Suit, defaultSuit:Suit):number {
  if(firstCard.rank === secondCard.rank && firstCard.suit === secondCard.suit) return 0;
  if(firstCard.suit !== secondCard.suit) {
    if(firstCard.suit === trump) return 1;
    if(secondCard.suit === trump) return -1;
    if(firstCard.suit === defaultSuit) return 1;
    if(secondCard.suit === defaultSuit) return -1;
    return 1;
  }
  if(rankToValue(firstCard.rank) > rankToValue(secondCard.rank)) return 1;
  return -1;
}

function rankToValue(rank:Rank):number {
  if(rank === 'A') return 14;
  if(rank === 'J') return 11;
  if(rank === 'Q') return 12;
  if(rank === 'K') return 13;
  return parseInt(rank);
}