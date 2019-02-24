import { Card } from "./card";

export const enum MessageType {
  Join = 'Join',
  Deal = 'Deal',
  Hand = 'Hand',
  AllPlayers = 'AllPlayers'
}
export interface Message {
  action: MessageType;
}

export interface MessageHand extends Message { cards: Card[] };