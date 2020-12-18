import { ICard, Suit } from "./card";

export interface PlayerInfo {
  cardCount: number;
  name: string;
  selectedCard: ICard;
}

export const enum GameState {
  WaitingForPlayersToJoin = 'WaitingForPlayersToJoin',
  DealingCards = 'DealingCards',
  WaitingForPlayerToSetJudgement = 'WaitingForPlayerToSetJudgement',
  WaitingForPlayerToPlayCard = 'WaitingForPlayerToPlayCard',
  CalculatingWinner = 'CalculatingWinner'
}

export const enum MessageType {
  Join = 'Join',
  JoinComplete = 'JoinComplete',
  Deal = 'Deal',
  Hand = 'Hand',
  AllPlayers = 'AllPlayers',
  PlayCard = 'PlayCard',
  Error = 'Error',
  AllScores = 'AllScores',
  SetJudgement = 'SetJudgement'
}

export interface IMessage {
  action: MessageType;
}

export interface ErrorMessage extends IMessage {
  code: string;
}

export interface PlayerInfoMessage extends IMessage {
  players: PlayerInfo[];
  currentSuit: Suit | null;
  trumpSuit: Suit | null;
  currentPlayerName: string | null;
  gameState: GameState;
}

export interface PlayerHandMessage extends IMessage {
  cards: ICard[];
}

export interface JoinMessage extends IMessage {
  name: string;
}

export interface PlayCardMessage extends IMessage {
  card: ICard;
}

export interface SetJudgementMessage extends IMessage {
  prediction: number;
}

export interface PlayerScoreMessage extends IMessage {
  scores: any;
}

export interface JoinCompleteMessage extends IMessage {
  isJoined: boolean;
}

export type Message = PlayCardMessage | JoinMessage | PlayerHandMessage | PlayerInfoMessage | ErrorMessage | SetJudgementMessage | PlayerScoreMessage | JoinCompleteMessage;