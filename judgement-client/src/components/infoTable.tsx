import React from "react";
import { Text, Stack } from "office-ui-fabric-react";
import { Suit } from "./card";

export interface InfoTableProps {
  trumpSuit: Suit;
  currentSuit: Suit;
  currentPlayerName: string | null;
}

export default class InfoTable extends React.Component<InfoTableProps> {
  render() {
    let infoStyles = {
      fontSize: 20
    };
    return (
      <Stack gap={10} verticalAlign='center'>
        <Text style={infoStyles}>Trump Suit {this.suitToUnicode(this.props.trumpSuit)}</Text>
        {/* <SpecialCard type={this.mapSuitToSpecialCardType(this.state.trumpSuit)} /> */}
        <Text style={infoStyles}>Current Suit {this.suitToUnicode(this.props.currentSuit)}</Text>            
        {/* <SpecialCard type={this.mapSuitToSpecialCardType(this.state.currentSuit)} /> */}
        <Text style={infoStyles}>Who's turn? <b>{this.props.currentPlayerName ? this.props.currentPlayerName : "None"}</b></Text>
      </Stack>
    )
  }

  suitToUnicode = (suit: Suit) => {
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
        return '♠';
    }
  }

  // private mapSuitToSpecialCardType(suit: Suit | null): SpecialCardType {
  //   switch (suit) {
  //     case Suit.Clubs:
  //       return SpecialCardType.ClubsSuit
  //     case Suit.Hearts:
  //       return SpecialCardType.HeartsSuit
  //     case Suit.Diamonds:
  //       return SpecialCardType.DiamondsSuit
  //     case Suit.Spades:
  //       return SpecialCardType.SpadesSuit
  //     default:
  //       return SpecialCardType.BlueBack;
  //   }
  // }
}