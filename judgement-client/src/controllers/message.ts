import { ICard, Suit } from "../components/card";

export interface PlayerInfo {
    name: string;
    cardCount: number;
    selectedCard: ICard | null;
}
export enum MessageType {
    Deal = 'Deal',
    Join = 'Join',
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

export type Message = PlayCardMessage | JoinMessage | PlayerHandMessage | PlayerInfoMessage | ErrorMessage | SetJudgementMessage | PlayerScoreMessage;