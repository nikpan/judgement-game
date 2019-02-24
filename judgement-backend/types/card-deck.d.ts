export = deck;
declare class deck {
  constructor(arr: any[]);
  addRandom(cards: any[]): any;
  addToBottom(cards: any[]): any;
  addToTop(cards: any[]): any;
  bottom(count: number): any[];
  cards(cardArray: any[]): any;
  draw(count: number): any[];
  drawFromBottom(count: number): any[];
  drawRandom(count: number): any[];
  drawWhere(predicate: any, count: number): any[];
  random(count: number): any[];
  remaining(): number;
  shuffle(): void;
  shuffleToBottom(cards: any[]): void;
  shuffleToTop(cards: any[]): void;
  top(count: number): any[];
}
