import WebSocket from 'ws';
import { ICard } from "./card";
import Logger from './logger';
import { MessageType, SetJudgementMessage, PlayCardMessage, JoinMessage, Message } from "./message";
import { Room } from "./room";
import { getId } from "./util";

export interface IPlayer {
    dispose: () => void;
    renewSocket: (socket:WebSocket) => void;
    id: number;
    socket: WebSocket;
    name: string;
    selectedCard: ICard | null;
    hand: ICard[];
    sendHand: () => void;
    sendMessage: (message: Message) => void;
}

export class Player implements IPlayer {
    public socket: WebSocket;
    private _room: Room;
    public name: string;
    private _hand: ICard[];
    private _selectedCard: ICard | null;
    public id: number;

    public get selectedCard(): ICard | null {
        return this._selectedCard;
    }

    public set selectedCard(card: ICard | null) {
        this._selectedCard = card;
        this._room.playerStateUpdated();
    }

    public get hand(): ICard[] {
        return this._hand;
    }

    public set hand(cards: ICard[]) {
        this._hand = cards;
        this._room.playerStateUpdated();
    }

    constructor(socket: WebSocket, room: Room) {
        this.socket = socket;
        this._room = room;
        this.id = getId();
        socket.on('message', (message) => {
            try {
                Logger.log(`Player::${this.name} on message start`);
                console.debug(message);
                let json = JSON.parse(message.toString());
                this.handleMessage(json);
                Logger.log(`Player::${this.name} on message end`);
            } catch (error) {
                Logger.log(`Failed to parse message from client ${message.toString()}. Exception: ${error}`);
            }
        });

        socket.on('close', () => {
            Logger.log(`${this.name} has left`);
            this._room.removePlayer(this.id);
        });
    }

    public renewSocket(socket: WebSocket) {
        this.socket = socket;
        socket.on('message', (message) => {
            try {
                Logger.log('Player');
                Logger.debug(message);
                let json = JSON.parse(message.toString());
                this.handleMessage(json);
            } catch (error) {
                Logger.log(`Failed to parse message from client ${message.toString()}. Exception: ${error}`);
            }
        });

        socket.on('close', () => {
            this._room.removePlayer(this.id);
            Logger.log(`${this.name} has left`);
        });
        this.sendHand();
    }

    public dispose() {
        this.socket.close();
    }

    private handleMessage(message: any) {
        if (message.action === MessageType.Join) {
            this.handleJoinMessage(message);
        }
        if (message.action === MessageType.StartGame) {
            this.handleStartGameMessage();
        }
        if (message.action === MessageType.PlayCard) {
            this.handlePlayCardMessage(message);
        }
        if (message.action === MessageType.SetJudgement) {
            this.handleSetJudgement(message);
        }
    }

    private handleStartGameMessage() {
        try {
            this._room.startGame(this.id);
        } catch (e) {
            Logger.debug(e);
            this.sendErrorMessage(`Couldn't Start Game: ${e.message}`);
        }
    }

    private handleSetJudgement(message: SetJudgementMessage) {
        try {
            this._room.setJudgement(this.id, message.prediction);
        }
        catch (e) {
            Logger.debug(e);
            this.sendErrorMessage(`Couldn't Set Judgement: ${e.message}`);
        }
    }

    private handlePlayCardMessage(message: PlayCardMessage) {
        const playedCard = message.card;
        // Check if card is present in hand
        if (!this.cardInHand(playedCard)) {
            this.sendErrorMessage('CardNotInHand');
            return;
        }
        try {
            this._room.playCard(this.id, playedCard);
            this.removeCardFromHand(playedCard);
            this.sendHand();
        } catch (e) {
            this.sendErrorMessage(`Couldn't Play Card: ${e.message}`);
        }
    }

    private handleJoinMessage(message: JoinMessage) {
        try {
            this.name = message.name;
            this.hand = [];
            this._room.join(this);
        } catch (e) {
            Logger.debug(e);
            this.sendErrorMessage(`Couldn't Join: ${e.message}`);
        }
    }

    private cardInHand(playedCard: ICard): boolean {
        let cardIndex = this.hand.findIndex(card => card.suit === playedCard.suit && card.rank === playedCard.rank);
        if (cardIndex === -1) return false;
        return true;
    }

    private removeCardFromHand(playedCard: ICard) {
        let cardIndex = this.hand.findIndex(card => card.suit === playedCard.suit && card.rank === playedCard.rank);
        if (cardIndex === -1) {
            throw new Error(`Can't remove card from hand when it doesn't exist in hand`);
        }
        this.hand.splice(cardIndex, 1);
        this._room.playerStateUpdated();
    }

    public sendHand() {
        this.sendMessage({
            action: MessageType.Hand,
            cards: this.hand
        });
    }

    public sendErrorMessage(errorCode: string) {
        this.sendMessage({
            action: MessageType.Error,
            code: errorCode
        });
    }

    public sendMessage(message: Message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
        else {
            Logger.log(`Error: Player::sendMessage Can't send message because socket is not open. Player:${this.name}`);
        }
    }
}