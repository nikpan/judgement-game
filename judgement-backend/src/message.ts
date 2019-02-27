import { ICard } from "./card";

export const enum MessageType {
  Join = 'Join',
  Deal = 'Deal',
  Hand = 'Hand',
  AllPlayers = 'AllPlayers',
  PlayCard = 'PlayCard'
}
export interface Message {
  action: MessageType;
  players?: any;
  cards?: any;
  name?: string;
  card?: ICard;
}