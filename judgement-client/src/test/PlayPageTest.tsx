import React from 'react';
import { ICard, Suit } from '../components/card';
import { PlayerScore, Score } from '../components/scorecard';
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
    const score1: Score = {
      hands: 3, isFinished: false, judgement: 3
    };
    const score2: Score = {
      hands: 3, isFinished: false, judgement: 4
    };
    const score3: Score = {
      hands: 3, isFinished: true, judgement: 3
    };
    const score4: Score = {
      hands: 3, isFinished: true, judgement: 4
    };
    const scores: PlayerScore[] = [
      {playerName: 'Jai', total: 100, scores: [score1, score1]},
      {playerName: 'Viru', total: 90, scores: [score2, score2]},
      {playerName: 'Gabbar', total: 80, scores: [score3, score3]},
      {playerName: 'Basanti', total: 70, scores: [score4, score4]},
      {playerName: 'Samba', total: 70, scores: [score4, score4]},
      {playerName: 'Ramlal', total: 70, scores: [score4, score4]},

    ];
    const otherPlayers: PlayerInfo[] = [
      {name: 'Jai', cardCount: 3, selectedCard: selectedCard},
      {name: 'Viru', cardCount: 3, selectedCard: null},
      {name: 'Basanti', cardCount: 3, selectedCard: null},
      {name: 'Thakur', cardCount: 3, selectedCard: null},
      {name: 'Samba', cardCount: 3, selectedCard: null},
      {name: 'Ramlal', cardCount: 3, selectedCard: null},

    ];
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