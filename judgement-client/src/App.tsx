import React from 'react';
import './App.css';
import { ICard, Rank, Suit } from './components/card';
import { PlayerScore } from './components/scorecard';
import {
  Message,
  MessageType,
  ErrorMessage,
  PlayerHandMessage,
  PlayerInfo, 
  PlayerScoreMessage,
  ClientGameState,
  PlayerListMessage,
  PlayerInfoMessageV2,
  GameStateInfoMessage
} from './controllers/message';
import HomePage from './pages/HomePage';
import WaitingPage from './pages/WaitingPage';
import { Utils } from './utils/utils';
import PlayPage from './pages/PlayPage';

export interface AppState {
  webSocket: WebSocket | null;
  name: string;
  cards: ICard[];
  otherPlayers: PlayerInfo[];
  selectedCard: ICard | null;
  prediction: number | null;
  currentSuit: Suit | null;
  trumpSuit: Suit;
  currentPlayerName: string | null;
  firstTurnPlayerName: string | null;
  currentGameState: ClientGameState;
  scores: PlayerScore[] | null;
  roomCode: string;
  playerList: string[];
}

class App extends React.Component<{}, AppState> {
  // private static readonly _wsConnectionUrl: string = 'ws://localhost:3001';
  private static readonly _wsConnectionUrl: string = 'wss://judgementgame-backend.azurewebsites.net'
  private _retryAttempts: number = 0;
  private _maxRetryAttempts: number = 5;
  constructor(props: any) {
    super(props);
    this.state = {
      webSocket: null,
      name: '',
      cards: [],
      otherPlayers: [],
      selectedCard: null,
      prediction: null,
      currentSuit: null,
      trumpSuit: Suit.Spades,
      currentPlayerName: null,
      firstTurnPlayerName: null,
      currentGameState: ClientGameState.ChoosingName,
      scores: null,
      roomCode: '',
      playerList: []
    };
  }

  componentDidMount() {
  }

  /** Home Page */
  closeConnection = () => {
    if (this.state.webSocket != null) {
      this.state.webSocket.close();
    }
  }

  onPredictionTextChange = (event: any) => {
    let val = event.target.value;
    let prediction: number | null = parseInt(val);
    console.log(prediction);
    prediction = isNaN(prediction) ? null : prediction; 
    this.setState( {prediction: prediction });
  }

  onCreateRoomClick = (name: string) => {
    this.setState({
      name: name
    })
    this.closeConnection();
    const createRoomMessage = {
      action: MessageType.CreateRoom,
      name: name
    };
    this.openConnectionAndSendMessage(createRoomMessage);
    this.setState({
      currentGameState: ClientGameState.Joining
    });
  }

  onJoinRoomClick = (name: string, roomCode: string) => {
    this.setState({
      name: name,
      roomCode: roomCode
    });
    this.closeConnection();
    const joinMessage = {
      action: MessageType.JoinRoom,
      name: name,
      roomCode: roomCode
    };
    this.openConnectionAndSendMessage(joinMessage);
    this.setState({
      currentGameState: ClientGameState.Joining
    });
  }

  openConnectionAndSendMessage = (message: Message) => {
    const ws = new WebSocket(App._wsConnectionUrl);
    this.setState({ webSocket: ws });
    ws.onopen = () => {
      console.debug('Connection established!');
      this._retryAttempts = 0;
      this.sendServerMessage(message);
    };
    ws.onmessage = (msg) => {
      var message = JSON.parse(msg.data);
      this.handleServerMessage(message as Message);
      console.log('Message from server:');
      console.debug(message);
    };
    ws.onerror = (msg) => {
      console.log(msg);
      Utils.showErrorPopup(`Connection to game server lost. Click OK to retry...`);
      setTimeout(() => {
        this.retryConnection();
      }, 2000); 
    }
    ws.onclose = (msg) => {
      console.log(msg);
      Utils.showErrorPopup(`Connection to game server lost. Click OK to retry...`);
      setTimeout(() => {
        this.retryConnection();
      }, 2000); 
    }
    //TODO: add a connection timeout
  }

  retryConnection() {
    this._retryAttempts = this._retryAttempts + 1;
    if(this._retryAttempts >= this._maxRetryAttempts) {
      Utils.showErrorPopup(`Can't connect to game server. Giving up!`);
      this.setState({
        currentGameState: ClientGameState.ChoosingName
      });
      return;
    }
    const rejoinMessage = {
      action: MessageType.JoinRoom,
      name: this.state.name,
      roomCode: this.state.roomCode
    };
    this.openConnectionAndSendMessage(rejoinMessage);
  }

  /** Waiting Page */
  onStartGameClick = () => {
    this.sendServerMessage({
      action: MessageType.StartGame
    });
    this.setState({
      currentGameState: ClientGameState.Starting
    });
  };
  
  /** Playing Page*/
  onCardClick = (suit: Suit, rank: Rank) => {
    if (this.state.selectedCard != null) return;
    this.sendServerMessage({
      action: MessageType.PlayCard,
      card: {
        suit: suit,
        rank: rank
      }
    });
  }

  onSetPrediction = (prediction: number) => {
    this.setState({
      prediction: prediction
    });
    this.sendServerMessage({
      action: MessageType.SetJudgement,
      prediction: prediction
    });
  }

  render = () => {
    const currentState = this.state.currentGameState;
    const showHomePage = currentState === ClientGameState.ChoosingName || currentState === ClientGameState.Joining;
    const showWaitingPage = currentState === ClientGameState.WaitingToStartGame || currentState === ClientGameState.Starting;
    const showPlayPage = currentState === ClientGameState.PredictionPhase || currentState === ClientGameState.PlayPhase || currentState === ClientGameState.CalculatingWinner;
    const predictionEditable = currentState === ClientGameState.PredictionPhase && this.state.currentPlayerName === this.state.name;

    return (
      <div>
        <h1>
          Judgement Game {this.state.name ? `- ${this.state.name}` : ''}
        </h1>
        {/* Home Page */}
        {showHomePage ? this.renderHomePage() : <></>}
        {/* Waiting Page */}
        {showWaitingPage ? this.renderWaitingPage() : <></>}
        {/* Playing Page */}
        {showPlayPage ? this.renderPlayPage(predictionEditable) : <></>}
      </div>
    );
  }

  private renderPlayPage(predictionEditable: boolean) {
    return <PlayPage onCardClick={this.onCardClick} onSetPrediction={this.onSetPrediction} scores={this.state.scores} predictionEditable={predictionEditable} {...this.state}/>;
  }

  private renderWaitingPage() {
    return <WaitingPage name={this.state.name} roomCode={this.state.roomCode} playerList={this.state.playerList} onStartGameClick={this.onStartGameClick} />;
  }

  private renderHomePage() {
    return <HomePage onCreateRoomClick={this.onCreateRoomClick} onJoinRoomClick={this.onJoinRoomClick} />;
  }

  /** Common functions */
  private sendServerMessage(message: any) {
    if (this.state.webSocket == null) {
      Utils.showErrorPopup(`Error: Can't send message because websocket is null`);
      return;
    }
    console.log('Sending Message');
    console.debug(message);
    this.state.webSocket.send(JSON.stringify(message));
  }

  private handleServerMessage(msgData: Message) {
    if (msgData.action === MessageType.PlayerList) {
      msgData = msgData as PlayerListMessage;
      this.handlePlayerListMessage(msgData);
    }
    else if (msgData.action === MessageType.Hand) {
      msgData = msgData as PlayerHandMessage;
      this.handlePlayerHandMessage(msgData);
    }
    else if (msgData.action === MessageType.PlayerInfo) {
      msgData = msgData as PlayerInfoMessageV2;
      this.handlePlayerInfoMessageV2(msgData);
    }
    else if (msgData.action === MessageType.GameStateInfo) {
      msgData = msgData as GameStateInfoMessage;
      this.handleGameStateInfoMessage(msgData);
    }
    else if (msgData.action === MessageType.Error) {
      msgData = msgData as ErrorMessage;
      this.handleErrorMessage(msgData);
    }
    else if (msgData.action === MessageType.AllScores) {
      msgData = msgData as PlayerScoreMessage;
      this.handleAllScoresMessage(msgData);
    }
    else {
      console.log('Unidentified Message');
      console.debug(msgData);
    }

  }
  
  private handleAllScoresMessage(message: PlayerScoreMessage) {
    this.setState({
      scores: message.scores
    });
  }

  private handleErrorMessage(message: ErrorMessage) {
    Utils.showErrorPopup(`Error: ${message.code}`);
  }

  private handlePlayerListMessage(message: PlayerListMessage) {
    console.debug(message.playerList);
    this.setState({
      roomCode: message.roomCode,
      playerList: message.playerList,
      currentGameState: ClientGameState.WaitingToStartGame
    });
  }

  private handlePlayerInfoMessageV2(message: PlayerInfoMessageV2) {
    let otherPlayerInfos = message.players;
    let myInfo;
    while(true) {
      myInfo = otherPlayerInfos.shift();
      if(myInfo!.name === this.state.name) {
        break;
      }
      otherPlayerInfos.push(myInfo!);
    }

    this.setState({
      otherPlayers: otherPlayerInfos,
      selectedCard: myInfo!.selectedCard,
    });
  }

  private handleGameStateInfoMessage(message: GameStateInfoMessage) {
    if(this.state.currentGameState !== message.gameState && message.gameState === ClientGameState.PredictionPhase) {
      this.setState({
        prediction: null
      })
    }
    this.setState({
      trumpSuit: message.trumpSuit!,
      currentSuit: message.currentSuit!,
      currentPlayerName: message.currentPlayerName!,
      firstTurnPlayerName: message.firstTurnPlayerName!,
      currentGameState: message.gameState
    });
  }

  private handlePlayerHandMessage(message: PlayerHandMessage) {
    var cardsFromServer = message.cards;
    this.setState({ cards: cardsFromServer });
  }
}

export default App;
