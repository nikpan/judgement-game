import Deck from 'card-deck';
import { ICard, Suit } from './card';

const cards: ICard[] = [
  { suit: Suit.Spades, rank: 'A' },
  { suit: Suit.Spades, rank: '2' },
  { suit: Suit.Spades, rank: '3' },
  { suit: Suit.Spades, rank: '4' },
  { suit: Suit.Spades, rank: '5' },
  { suit: Suit.Spades, rank: '6' },
  { suit: Suit.Spades, rank: '7' },
  { suit: Suit.Spades, rank: '8' },
  { suit: Suit.Spades, rank: '9' },
  { suit: Suit.Spades, rank: '10' },
  { suit: Suit.Spades, rank: 'J' },
  { suit: Suit.Spades, rank: 'Q' },
  { suit: Suit.Spades, rank: 'K' },

  { suit: Suit.Hearts, rank: 'A' },
  { suit: Suit.Hearts, rank: '2' },
  { suit: Suit.Hearts, rank: '3' },
  { suit: Suit.Hearts, rank: '4' },
  { suit: Suit.Hearts, rank: '5' },
  { suit: Suit.Hearts, rank: '6' },
  { suit: Suit.Hearts, rank: '7' },
  { suit: Suit.Hearts, rank: '8' },
  { suit: Suit.Hearts, rank: '9' },
  { suit: Suit.Hearts, rank: '10' },
  { suit: Suit.Hearts, rank: 'J' },
  { suit: Suit.Hearts, rank: 'Q' },
  { suit: Suit.Hearts, rank: 'K' },

  { suit: Suit.Diamonds, rank: 'A' },
  { suit: Suit.Diamonds, rank: '2' },
  { suit: Suit.Diamonds, rank: '3' },
  { suit: Suit.Diamonds, rank: '4' },
  { suit: Suit.Diamonds, rank: '5' },
  { suit: Suit.Diamonds, rank: '6' },
  { suit: Suit.Diamonds, rank: '7' },
  { suit: Suit.Diamonds, rank: '8' },
  { suit: Suit.Diamonds, rank: '9' },
  { suit: Suit.Diamonds, rank: '10' },
  { suit: Suit.Diamonds, rank: 'J' },
  { suit: Suit.Diamonds, rank: 'Q' },
  { suit: Suit.Diamonds, rank: 'K' },

  { suit: Suit.Clubs, rank: 'A' },
  { suit: Suit.Clubs, rank: '2' },
  { suit: Suit.Clubs, rank: '3' },
  { suit: Suit.Clubs, rank: '4' },
  { suit: Suit.Clubs, rank: '5' },
  { suit: Suit.Clubs, rank: '6' },
  { suit: Suit.Clubs, rank: '7' },
  { suit: Suit.Clubs, rank: '8' },
  { suit: Suit.Clubs, rank: '9' },
  { suit: Suit.Clubs, rank: '10' },
  { suit: Suit.Clubs, rank: 'J' },
  { suit: Suit.Clubs, rank: 'Q' },
  { suit: Suit.Clubs, rank: 'K' },
];

class StandardDeck {
  private _deck: any;
  constructor() {
    this._deck = new Deck(JSON.parse(JSON.stringify(cards)));
  }

  resetDeck(): void {
    this._deck.cards(JSON.parse(JSON.stringify(cards)));
  }

  drawRandom(count: number): ICard[] {
    if (count == 1) return [this._deck.drawRandom(count)];
    else return this._deck.drawRandom(count);
  }

  remaining(): number {
    return this._deck.remaining();
  }
}

export default StandardDeck