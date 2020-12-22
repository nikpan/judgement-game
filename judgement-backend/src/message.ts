import { ICard, Suit } from "./card";

export interface PlayerInfo {
  cardCount: number;
  name: string;
  selectedCard: ICard;
}

export enum ClientGameState {
  ChoosingName = 'ChoosingName',
  Joining = 'Joining',
  WaitingToStartGame = 'WaitingToStartGame',
  Starting = 'Starting',
  PredictionPhase = 'PredictionPhase',
  PlayPhase = 'PlayPhase',
  CalculatingWinner = 'CalculatingWinner'
}

export const enum MessageType {
  Join = 'Join',
  Hand = 'Hand',
  PlayCard = 'PlayCard',
  Error = 'Error',
  AllScores = 'AllScores',
  SetJudgement = 'SetJudgement',
  JoinRoom = 'JoinRoom',
  CreateRoom = 'CreateRoom',
  StartGame = 'StartGame',
  PlayerList = 'PlayerList',
  PlayerInfo = 'PlayerInfo',
  GameStateInfo = 'GameStateInfo'
}

export interface IMessage {
  action: MessageType;
}

export interface ErrorMessage extends IMessage {
  code: string;
}

export interface PlayerInfoMessageV2 extends IMessage {
  players: PlayerInfo[];
}

export interface GameStateMessage extends IMessage {
  currentSuit: Suit | null;
  trumpSuit: Suit | null;
  currentPlayerName: string | null;
  gameState: ClientGameState;
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

export interface JoinRoomMessage extends IMessage {
  name: string;
  roomCode: string;
}

export interface CreateRoomMessage extends IMessage {
  name: string;
}

export interface PlayerListMessage extends IMessage {
  roomCode: string;
  playerList: string[];
}

export type Message = PlayCardMessage 
                    | JoinMessage 
                    | PlayerHandMessage 
                    | ErrorMessage 
                    | SetJudgementMessage 
                    | PlayerScoreMessage 
                    | JoinCompleteMessage
                    | JoinRoomMessage
                    | CreateRoomMessage
                    | PlayerListMessage
                    | PlayerInfoMessageV2
                    | GameStateMessage;