import WebSocket from 'ws';
import { ICard } from "./card";
import { MessageType, SetJudgementMessage, PlayCardMessage, JoinMessage, Message } from "./message";
import { IPlayer } from "./player";
import { RoomV2 } from "./roomV2";
import { getId } from "./util";

export class PlayerV2 implements IPlayer {
    public socket: WebSocket;
    private _room: RoomV2;
    public name: string;
    public hand: ICard[];
    public selectedCard: ICard | null;
    public id: number;

    constructor(socket: WebSocket, room: RoomV2) {
        this.socket = socket;
        this._room = room;
        this.id = getId();
        socket.on('message', (message) => {
            try {
                let json = JSON.parse(message.toString());
                this.handleMessage(json);
            } catch (error) {
                console.log(`Failed to parse message from client ${message.toString()}. Exception: ${error}`);
            }
        });

        socket.on('close', () => {
            this._room.removePlayer(this.id);
            console.log(`${this.name} has left`);
        });
    }

    private handleMessage(message: any) {
        if (message.action === MessageType.Join) {
            this.handleJoinMessage(message);
        }
        if (message.action === MessageType.Deal) {
            this._room.deal(this.id);
        }
        if (message.action === MessageType.PlayCard) {
            this.handlePlayCardMessage(message);
        }
        if (message.action === MessageType.SetJudgement) {
            this.handleSetJudgement(message);
        }
    }

    private handleSetJudgement(message: SetJudgementMessage) {
        try {
            this._room.setJudgement(this.id, message.prediction);
        }
        catch (e) {
            console.debug(e);
            this.sendErrorMessage(e.message);
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
        } catch (error) {
            this.sendErrorMessage(`Couldn't Play Card: ${error.message}`);
        }
    }

    private handleJoinMessage(message: JoinMessage) {
        this.name = message.name;
        this.hand = [];
        this._room.join(this);
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
        })
    }

    public sendMessage(message: Message) {
        if (this.socket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
        else {
            console.log(`Error: Player::sendMessage Can't send message because socket is not open. Player:${this.name}`);
        }
    }
}