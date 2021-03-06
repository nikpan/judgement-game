import React from "react";
import HiddenHand from "./hiddenHand";
import Hand from "./hand";
import { PlayerInfo } from "../controllers/message";
import { ICard, Rank, Suit } from "./card";
import './table.css';

export interface TableProps {
  otherPlayers: PlayerInfo[];
  name: string;
  selectedCard: ICard | null;
  cards: ICard[];
  currentPlayerName: string | null;
  onCardClick: (suit: Suit, rank: Rank) => void;
}

export default class Table extends React.Component<TableProps> {
  renderOtherPlayers = () => {
    if(this.props.otherPlayers) {
      let otherPlayers = new Array();
      this.props.otherPlayers.forEach((player,i) => {
        otherPlayers.push(
          <HiddenHand 
            key={i.toString()} 
            selectedCard={player.selectedCard} 
            name={player.name} 
            cardCount={player.cardCount}
            active={player.name === this.props.currentPlayerName} />)
      })
      return otherPlayers;
    }
    return null;
  }

  render() {
    return (
      <div className='playerTable'>
        <div className='otherPlayersContainer'>
          {this.renderOtherPlayers()}
        </div>
        <Hand
          name={this.props.name}
          cards={this.props.cards}
          selectedCard={this.props.selectedCard} 
          cardSelected={this.props.onCardClick}
          active={this.props.name === this.props.currentPlayerName}
        />
      </div>
    )
  }
}