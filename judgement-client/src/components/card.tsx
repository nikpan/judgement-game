import * as React from 'react';
import './card.css';
import getImageSrc from './imgLoader';

export interface ICard {
  suit: Suit;
  rank: Rank;
}

export enum Suit {
  Hearts = 'H',
  Spades = 'S',
  Diamonds = 'D',
  Clubs = 'C'
}

export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardProps extends ICard {
  hidden: boolean;
  cardSelected?: (suit:Suit, rank:Rank) => void;
}

export default class Card extends React.Component<CardProps> {
  cardClickHandler = (event:any) => {
    console.log(event);
    if(this.props.cardSelected){
      this.props.cardSelected(this.props.suit, this.props.rank);
    }
  };
  render() {
    if (this.props.hidden) {
      return (
        <div className="cardDiv">
          <img src={getImageSrc('BlueBack')} className='cardImg' alt='card back' /></div>
      )
    }
    else if (this.validateProps()) {
      return (
        <div className="cardDiv">{this.renderCard()}</div>
      )
    }
    else {
      return (
        <div>Invalid Card</div>
      )
    }
  }

  validateProps() {
    let ret = true;
    switch (this.props.suit) {
      case "H":
      case "S":
      case "D":
      case "C":
        ret = ret && true;
        break;
      default:
        ret = ret && false;
        break;
    }
    switch (this.props.rank) {
      case "A":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "10":
      case "J":
      case "Q":
      case "K":
        ret = ret && true;
        break;
      default:
        ret = ret && false;
        break;
    }
    return ret;
  }

  renderCard() {
    let imgName = "./resources/img/" + this.props.rank + this.props.suit + ".png";
    console.log(imgName);
    return (
      <img src={getImageSrc(this.props.rank + this.props.suit)} className="cardImg" alt="cardImage" onClick={this.cardClickHandler}/>
    )
  }
}