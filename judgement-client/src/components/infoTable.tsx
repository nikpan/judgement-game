import React from "react";
import { Text, Stack } from "office-ui-fabric-react";
import { Suit } from "./card";
import { ClientGameState } from "../controllers/message";

export interface InfoTableProps {
  trumpSuit: Suit;
  currentSuit: Suit | null;
  currentPlayerName: string | null;
  firstTurnPlayerName: string | null;
  currentGameState: ClientGameState;
}

export default class InfoTable extends React.Component<InfoTableProps> {
  render() {
    let infoStyles = {
      fontSize: 20
    };
    return (
      <Stack horizontal gap={10}>
        <Text style={infoStyles}>Trump Suit {this.suitToUnicode(this.props.trumpSuit)}</Text>
        <Text style={infoStyles}>Current Suit {this.suitToUnicode(this.props.currentSuit)}</Text>            
        <Text style={infoStyles}>Game State? <b>{this.props.currentGameState ? this.props.currentGameState : "None"}</b></Text>
        <Text style={infoStyles}>Who's turn? <b>{this.props.currentPlayerName ? this.props.currentPlayerName : "None"}</b></Text>
        <Text style={infoStyles}>First turn? <b>{this.props.firstTurnPlayerName ? this.props.firstTurnPlayerName : "None"}</b></Text>
      </Stack>
    )
  }

  suitToUnicode = (suit: Suit | null) => {
    switch (suit) {
      case Suit.Clubs:
        return <span style={{color: 'black'}}>♣</span>;
      case Suit.Hearts:
        return <span style={{color: 'red'}}>♥</span>;
      case Suit.Diamonds:
        return <span style={{color: 'red'}}>♦</span>;
      case Suit.Spades:
        return <span style={{color: 'black'}}>♠</span>;
      default:
        return <span style={{fontWeight: "bold"}}>Not Set</span>;
    }
  }
}