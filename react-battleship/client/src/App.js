import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardState: 0,
      boardPlayer1: [],
      boardPlayer2: []
    }
  }

  fire(e, player) {
    //board is set to player1 or 2 depending on click
    var board;
    if(player === 1) {
      board = this.state.boardPlayer1;
    } else {
      board = this.state.boardPlayer2;
    }
    var boardLetter;
    //boardNumber is xAxis
    //boardLetter is yAxis
    var boardNumber = e.charAt(1);
    if(e.charAt(0) === "A") {
      boardLetter = 0;
    } else if(e.charAt(0) === "B") {
      boardLetter = 1;
    } else if(e.charAt(0) === "C") {
      boardLetter = 2;
    } else if(e.charAt(0) === "D") {
      boardLetter = 3;
    } else if(e.charAt(0) === "E") {
      boardLetter = 4;
    } else if(e.charAt(0) === "F") {
      boardLetter = 5;
    } else if(e.charAt(0) === "G") {
      boardLetter = 6;
    } else if(e.charAt(0) === "H") {
      boardLetter = 7;
    } else if(e.charAt(0) === "I") {
      boardLetter = 8;
    } else if(e.charAt(0) === "J") {
      boardLetter = 9;
    }
    //send a POST request to backend with player and selected target
    axios.post('http://localhost:8080/fire', {
      boardPiece: e,
      player: player
    })
    .then(data => {
      //index is set to the index of the players shot in state
      var index = (boardLetter * 10) + Number(boardNumber);
      console.log('data ', data.data);
      //update board based on what was returned from POST request
      if(data.data === 'Miss') {
        board[index - 1][1] = "*";
      } else if(data.data === "Hit!") {
        board[index - 1][1] = "X";
      //if we get back either of these then the game is over and let the users know
      } else if(data.data === "Player1 Wins!" || data.data === "Player2 Wins!") {
        alert(data.data);
      }
      //an empty setState triggers a rerender of our components and is needed to update the boards
      this.setState({});
    })
    .catch(err => {
      console.log('err ', err);
    })
  }
  //sets up the initial board state for both players on load
  componentWillMount() {
    var boardPlayer1 = [];
    var boardPlayer2 = [];
    var count = 0;
    //outer loop is for yAxis
    for(var i = 0; i < 10; i++) {
      var letters = ["A","B","C","D","E","F","G","H","I","J"];
      for(var j = 1; j < 11; j++) {
        //inner loop is for xAxis
        boardPlayer1.push([letters[count] + j, 0]);
        boardPlayer2.push([letters[count] + j, 0]);
      }
      count++;
      this.setState({boardPlayer1: boardPlayer1, boardPlayer2: boardPlayer2});
    }
}
  //once components have mounted send a get request to the backend to initiate the game
  componentDidMount() {
    axios.get('http://localhost:8080/')
    .then(function(response) {
      console.log('response: ', response.data);
    })
    .catch(function(err) {
      console.log('response error ', err);
    })
  }

  render() {
    //each player has a unique board
    var boardDataPlayer1 = [];
    var boardDataPlayer2 = [];
    var count = 0;
    var boardPieceIndex = 0;
    //outer loop is similar to componentWillMount in operation
    for(var i = 0; i < 10; i++) {
      var letters = ["A","B","C","D","E","F","G","H","I","J"];
      var rowPlayer1 = [];
      var rowPlayer2 = [];
      for(var j = 1; j < 11; j++) {
        //create a span tag for each A1, A2, A3, etc... so we can indiviudally update each tag, value is set to this specific x and y position in state
        rowPlayer1.push(<span className={letters[count] + j} key={letters[count] + j} onClick={this.fire.bind(this, letters[count] + j, 1)}>{this.state.boardPlayer1[boardPieceIndex][1]}</span>);
        rowPlayer2.push(<span className={letters[count] + j} key={letters[count] + j} onClick={this.fire.bind(this, letters[count] + j, 2)}>{this.state.boardPlayer2[boardPieceIndex][1]}</span>);
        boardPieceIndex++;
      }
      //push each row into the correct player board once we have filled a 0-10 for A, B, C, etc.. to create a multidimensional array
      boardDataPlayer1.push(rowPlayer1);
      boardDataPlayer2.push(rowPlayer2);
      count++;
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Battleship</h2>
          <h3>0 = Untouched,  X = Hit,   * = Miss</h3>
        </div>
        <div className="gameBoards">
          <div className="board1">
            <p>Player 2 shoot here</p>
            <h4>1 2 3 4 5 6 7 8 9 10</h4>
            <p>A {boardDataPlayer1[0]}</p>
            <p>B {boardDataPlayer1[1]}</p>
            <p>C {boardDataPlayer1[2]}</p>
            <p>D {boardDataPlayer1[3]}</p>
            <p>E {boardDataPlayer1[4]}</p>
            <p>F {boardDataPlayer1[5]}</p>
            <p>G {boardDataPlayer1[6]}</p>
            <p>H {boardDataPlayer1[7]}</p>
            <p>I {boardDataPlayer1[8]}</p>
            <p>J {boardDataPlayer1[9]}</p>
          </div>
          <div className="board2">
            <p>Player 1 shoot here</p>
            <h4>1 2 3 4 5 6 7 8 9 10</h4>
            <p>A {boardDataPlayer2[0]}</p>
            <p>B {boardDataPlayer2[1]}</p>
            <p>C {boardDataPlayer2[2]}</p>
            <p>D {boardDataPlayer2[3]}</p>
            <p>E {boardDataPlayer2[4]}</p>
            <p>F {boardDataPlayer2[5]}</p>
            <p>G {boardDataPlayer2[6]}</p>
            <p>H {boardDataPlayer2[7]}</p>
            <p>I {boardDataPlayer2[8]}</p>
            <p>J {boardDataPlayer2[9]}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
