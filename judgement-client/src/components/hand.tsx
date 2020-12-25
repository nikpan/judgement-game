import React from 'react';
import Card, { ICard, Rank, Suit } from './card';
import './hand.css'

export interface HandProps {
  cards: ICard[];
  name: string;
  selectedCard: ICard | null;
  cardSelected: (suit:Suit, rank:Rank) => void;
}

export default class Hand extends React.Component<HandProps> {
  cardSelected = (suit:Suit, rank:Rank) => {
    this.props.cardSelected(suit, rank);
  };
  
  selectedCard = () => {
    if (this.props.selectedCard) return (
      <Card
        suit={this.props.selectedCard.suit}
        rank={this.props.selectedCard.rank}
      />
    )
    return null;
  }

  render() {
    const cards = this.sortCards(this.props.cards);
    return (
      <div>
        <h2 style={{textAlign:'center'}} >{this.props.name}'s Hand</h2>
        <div className='player'>
          <div className='playedCard'>
            <div className='handLeftBuffer'></div>
            {this.selectedCard()}
            <div className='handRightBuffer'></div>
          </div>
          <div className='playerHand'>
            <div className='handLeftBuffer'></div>
            {cards.map((card, i) => 
              <Card
                key={i}
                suit={card.suit} 
                rank={card.rank} 
                cardSelected={this.cardSelected}
              />
              )}
              <div className='handRightBuffer'></div>
          </div>
        </div>
      </div>
    )
  }

  private sortCards(cards: ICard[]) {
    if (!cards || cards.length == 0 || cards.length == 1) return cards;
    cards.sort((a,b) => {
      if (a.suit > b.suit) {
        return 1;
      }
      if(a.suit < b.suit) {
        return -1;
      }
      if(this.rankToValue(a.rank) > this.rankToValue(b.rank)) {
        return 1;
      }
      if(this.rankToValue(a.rank) < this.rankToValue(b.rank)) {
        return -1
      }
      return 0;
    })
    return cards;
  }

  private rankToValue(rank: string): number {
    switch (rank) {
      case 'J':
        return 11;
      case 'Q':
        return 12;
      case 'K':
        return 13;
      case 'A':
        return 14;
      default:
        const val = parseInt(rank);
        if (val >= 2 && val <= 10) return val;
        return -1
    }
    
  }
}