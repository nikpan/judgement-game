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

export function Winner (firstPlayer:ICard, secondPlayer:ICard, trump:Suit):number {
  if(firstPlayer.rank === secondPlayer.rank && firstPlayer.suit === secondPlayer.suit) return 0;
  if(firstPlayer.suit !== secondPlayer.suit) {
    if(firstPlayer.suit === trump) return 1;
    if(secondPlayer.suit === trump) return -1;
    return 1;
  }
  if(rankToValue(firstPlayer.rank) > rankToValue(secondPlayer.rank)) return 1;
  return -1;
}

function rankToValue(rank:Rank):number {
  if(rank === 'A') return 14;
  if(rank === 'J') return 11;
  if(rank === 'Q') return 12;
  if(rank === 'K') return 13;
  return parseInt(rank);
}