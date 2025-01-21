const WebSocket = require('ws');
const { spawn } = require('child_process');
const fs = require('fs');

var webSocket = new WebSocket("ws://localhost:8080/api/game-state");

const child = spawn('node', ['./client.js']);
let wins = 0;
let losses = 0;
let ties = 0;


webSocket.onmessage = function(event) {
  var gameState = JSON.parse(event.data);

  if (gameState.status === "game-over") {
    if (gameState.gameResult === "player-one-won") {
      wins++;
    }
    else if (gameState.gameResult === "player-two-won") {
      losses++;
    }
    else {
      ties++;
    }

    let data = `Wins: ${wins}\nLosses: ${losses}\nTies: ${ties}\n`;

    fs.writeFile('benchmark.o', data, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log(data);
      }
    });

    setTimeout(() => {
      const child = spawn('node', ['./client.js']);
    }, 5000); 
  }
};
