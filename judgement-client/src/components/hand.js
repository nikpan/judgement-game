import React from 'react';
import Card from './card';

export default class Hand extends React.Component {
    render(){
        
        const cards = this.props.cards;
        return (
            <div>
                <h2>{this.props.name}'s Hand</h2>
                <div>
                    {cards.map((card => <Card suit={card.suit} rank={card.rank}></Card>))}
                </div>
            </div>
        )
    }
}