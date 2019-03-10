import { ICard, Suit } from "./card";

export const enum MessageType {
  Join = 'Join',
  Deal = 'Deal',
  Hand = 'Hand',
  AllPlayers = 'AllPlayers',
  PlayCard = 'PlayCard',
  Error = 'Error'
}
export interface Message {
  action: MessageType;
  players?: any;
  cards?: any;
  name?: string;
  card?: ICard;
  code?: string;
  currentSuit?: Suit | null;
  trumpSuit?: Suit | null;
}