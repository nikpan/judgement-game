import React from 'react';
import Card, { CardProps } from './card';
import './hand.css'

export interface HandProps {
  cards: CardProps[];
  name: string;
  cardSelected: (suit:string, rank:string) => void;
}

export default class Hand extends React.Component<HandProps, {suit:string, rank:string }> {
  state = {suit: '', rank: ''};

  cardSelected = (suit:string, rank:string) => {
    this.setState({suit: suit, rank: rank});
    this.props.cardSelected(suit, rank);
  };
  doNothing = (suit: string, rank: string) => {}
  
  render() {
    const cards = this.sortCards(this.props.cards);
    return (
      <div>
        <h2>{this.props.name}'s Hand</h2>
        <div className='player'>
          <div className='playedCard'>
            <Card 
              suit={this.state.suit} 
              rank={this.state.rank} 
              hidden={false} 
              cardSelected={this.doNothing} />
          </div>
          <div className='playerHand'>
            {cards.map((card => 
              <Card 
                suit={card.suit} 
                rank={card.rank} 
                hidden={false} 
                cardSelected={this.cardSelected}>
              </Card>))}
          </div>
        </div>
      </div>
    )
  }

  private sortCards(cards: CardProps[]) {
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