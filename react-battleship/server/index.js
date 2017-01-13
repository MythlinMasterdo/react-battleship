var express = require('express');
var parser = require('body-parser');
var Promise = require("bluebird");

var app = express();
//for potential deployment used ENV
var port = process.env.PORT || 8080;
//0 is empty space, 1 is a ship, 2 is a hit, 3 is a miss
//keep track of boards on the backend
var player1 = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]
]
var player2 = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]
]
//once a player hits 17 the game is over, this keeps track of those scores
var player1Score = 0;
var player2Score = 0;
var letters = ["A","B","C","D","E","F","G","H","I","J"];

app.use(parser.json(), function(req, res, next) {
  //allowed cross origin request for localhost:3000 to localhost:8080
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

//runs on load
app.get('/', function(req, res) {
  //function returns random number 0-9, used to place ship at indexes
  var randomLocation = function(e) {
    return Math.floor(Math.random() * e);
  }
  //the length of each ship is represented as a number
  var ships = [5,4,3,3,2];
  var placeShips = function(player) {
    while(ships.length >= 1) {
      //gets Y axis for ship placement
      var shipLocationY = randomLocation(9);
      //gets X axis for ship placement
      var shipLocationX = randomLocation(ships[0]);
      //this if then setup checks for blockage in potential ship placement, if there is blockage it picks a new random number
      if(ships[0] === 5 && player[shipLocationY][shipLocationX] === 0 && player[shipLocationY][shipLocationX + 2] === 0 && player[shipLocationY][shipLocationX + 4] === 0) {
        //update value of the players board at this location for the length of the ship to 1
        player[shipLocationY][shipLocationX] = player[shipLocationY][shipLocationX + 1] = player[shipLocationY][shipLocationX + 2] = player[shipLocationY][shipLocationX + 3] = player[shipLocationY][shipLocationX + 4] = 1;
        //remove first element of ships array
        ships.shift();
      } else if(ships[0] === 4 && player[shipLocationY][shipLocationX] === 0 && player[shipLocationY][shipLocationX + 2] === 0 && player[shipLocationY][shipLocationX + 3] === 0) {
        //update value of the players board at this location for the length of the ship to 1
        player[shipLocationY][shipLocationX] = player[shipLocationY][shipLocationX + 1] = player[shipLocationY][shipLocationX + 2] = player[shipLocationY][shipLocationX + 3] = 1;
        //remove first element of ships array
        ships.shift();
      } else if(ships[0] === 3 && player[shipLocationY][shipLocationX] === 0 && player[shipLocationY][shipLocationX + 2] === 0) {
        //update value of the players board at this location for the length of the ship to 1
        player[shipLocationY][shipLocationX] = player[shipLocationY][shipLocationX + 1] = player[shipLocationY][shipLocationX + 2] = 1;
        //remove first element of ships array
        ships.shift();
      } else if(ships[0] === 2 && player[shipLocationY][shipLocationX] === 0 && player[shipLocationY][shipLocationX + 1] === 0) {
        //update value of the players board at this location for the length of the ship to 1
        player[shipLocationY][shipLocationX] = player[shipLocationY][shipLocationX + 1] = 1;
        //remove first element of ships array
        ships.shift();
      } else {
        //pick a new location
        shipLocationY = randomLocation(9);
      }
    }
  }
  //call above function on first player
  placeShips(player1);
  //ships is now a empty array so reset the array and call placeShips on player2
  ships = [5,4,3,3,2];
  placeShips(player2);
  res.send('Player 1 and 2 initiated');
})

app.post('/fire', function(req, res) {
  var currentPlayer;
  //xIndex represents where our shot is on the xAxis
  var xIndex = req.body.boardPiece.charAt(0);
  //yIndex is our shot on the yAxis
  var yIndex = Number(req.body.boardPiece.slice(1));
  //xIndex is set to the index of the letter it correlates with
  xIndex = letters.indexOf(xIndex);
  //setting currentPlayer so we can update the correct board
  if(req.body.player === 1) {
    currentPlayer = player1;
  } else {
    currentPlayer = player2;
  }
  //if the shot location is a miss, return miss to front end
  if(currentPlayer[xIndex][yIndex - 1] === 0) {
    currentPlayer[xIndex][yIndex - 1] = 3;
    res.send('Miss');
  //if the shot is a hit then update correct playerScore, board, and return Hit to front end
  } else if(currentPlayer[xIndex][yIndex - 1] === 1) {
    currentPlayer[xIndex][yIndex - 1] = 2;
    if(currentPlayer === 1) {
      player1Score++;
    } else {
      player2Score++;
    }
    //if player has 17 hits then they win and send back winner rather than hit
    if(player1Score === 17) {
      res.send('Player1 Wins!');
    } else if(player2Score === 17) {
      res.send('Player2 Wins!');
    } else {
      res.send('Hit!');
    }
  //location has already been hit, let user know
  } else {
    res.send('Location has already been shot at!');
  }
  //send player1 or 2 data from react and then xIndex finds x location
})

app.listen(port, function() {
  console.log('listening on port ', port);
});

module.exports = app;
