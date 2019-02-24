import React from 'react';
import Card, { CardProps } from './card';

export interface HandProps {
  cards: CardProps[];
  name: string;
}

export default class Hand extends React.Component<HandProps> {
  render() {
    const cards = this.props.cards;
    return (
      <div>
        <h2>{this.props.name}'s Hand</h2>
        <div>
          {cards.map((card => <Card suit={card.suit} rank={card.rank} hidden={false}></Card>))}
        </div>
      </div>
    )
  }

  private sortCards(cards: CardProps[]) {
    // TODO: complete sorting logic
    // cards.sort((a,b) => {
    //   if (a.rank === b.rank) {
        
    //   }
    // })
  }
}