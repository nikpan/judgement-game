import React from 'react';
import { ICard, Rank, Suit } from './components/card';
import Table, { TableProps } from './components/table';
import { PlayerInfo } from './controllers/message';

class TableTest extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }
  
  componentDidMount() {
  }

  render = () => {
    const sampleCard: ICard = {suit: Suit.Spades, rank: 'A'};
    const sampleOtherPlayer: PlayerInfo = {
      cardCount: 3,
      name: 'Other Foo',
      selectedCard: sampleCard
    }
    const tableProps: TableProps = {
      cards: [sampleCard, sampleCard, sampleCard],
      name: 'Foo',
      selectedCard: sampleCard,
      onCardClick: this.onCardClick,
      otherPlayers: [sampleOtherPlayer, sampleOtherPlayer, sampleOtherPlayer]
    }
    return (
      <Table {...tableProps} onCardClick={this.onCardClick} />
    )
  }

  onCardClick = (_suit: Suit, _rank: Rank) => {
    
  }
}

export default TableTest;