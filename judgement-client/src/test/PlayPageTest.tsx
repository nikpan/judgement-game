import React from 'react';
import { ICard, Suit } from '../components/card';
import { PlayerScore } from '../components/scorecard';
import { ClientGameState, PlayerInfo } from '../controllers/message';
import PlayPage from '../pages/PlayPage';

export default class PlayPageTest extends React.Component<{},{}> {
  constructor(props: any) {
    super(props);
  }

  render = () => {
    const name = 'Gabbar';
    const selectedCard: ICard = {suit: Suit.Spades, rank: 'A'};
    const cards: ICard[] = [selectedCard, selectedCard, selectedCard];
    const scores: PlayerScore[] = [
      {playerName: 'Jai', total: 100, scores: []},
      {playerName: 'Viru', total: 90, scores: []},
      {playerName: 'Gabbar', total: 80, scores: []},
      {playerName: 'Basanti', total: 70, scores: []},
    ];
    const otherPlayers: PlayerInfo[] = [
      {name: 'Jai', cardCount: 3, selectedCard: selectedCard},
      {name: 'Viru', cardCount: 3, selectedCard: null},
      {name: 'Basanti', cardCount: 3, selectedCard: null},
      {name: 'Thakur', cardCount: 3, selectedCard: null},
      {name: 'Samba', cardCount: 3, selectedCard: null},
      {name: 'Ramlal', cardCount: 3, selectedCard: null},

    ];
    const roomCode = '12345';
    const playerList = ['Jai', 'Viru', 'Gabbar', 'Basanti']
    return (
      <PlayPage 
        name={name} 
        predictionEditable={true} 
        selectedCard={selectedCard} 
        cards={cards}
        trumpSuit={Suit.Spades}
        currentSuit={null}
        currentPlayerName={'Gabbar'}
        firstTurnPlayerName={'Gabbar'}
        otherPlayers={otherPlayers}
        currentGameState={ClientGameState.PredictionPhase}
        scores={scores}
        onCardClick={this.dummyMethod} 
        onSetPrediction={this.dummyMethod} />
    );
  }

  dummyMethod = (...args: any) => {
    console.debug(args);
  }
}