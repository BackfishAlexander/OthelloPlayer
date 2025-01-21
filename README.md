# Alex Backfish Othello Solution
A solution for a bot that connects to a server and plays [Othello](https://www.ultraboardgames.com/othello/game-rules.php) using the **Minimax Algorithm**

## Getting Started 🚀
First, start the server:
    
    cd Server
    ./start.sh

Now, make sure you have the required npm package(s) installed: `npm install`
 - To run the client: `node client.js [optional max_depth] [optional port] [optional hostname]`

 - To run my custom benchmark: `node benchmark.js`

 - To run tests: `npm run test`

> **Note**
> If your system struggles to run the algorithm, try running max_depth lower than it's default of 9

## Benchmark 🧪
Connects to the server with a client repeatedly. Keeps track of how many games the bot Wins VS Loses VS Ties 

In my benchmark of **50** games,
    
    Wins:   47
    Loses:  3
    Ties:   0

## Software Versions 🖥️
* Node 8.12.0
* NPM 6.8.0

## Solution Explained ✅

* Solution implements **Minimax Algorithm**
* Minimax simulates every possible game position, giving a score for each board state
* Minimax recursively calls itself to simulate all possible games up to `max-depth = d`
* Minimax assumes that for each of your moves, you will play YOUR best move and your opponent will play THEIR best move.
* Whichever branch of simulated moves provide the highest score for your player gets chosen

## Improvements 🛠️
 - Rewrite in a more efficient programming language
 - Optimize for mirrored board positions
 - Pre-calculate early moves to a higher depth
 - Include Othello-specific logic (i.e. understanding the value of corner/edge pieces)
 - Optimize isMoveValid() and simulateMove() functions as they may run hundreds of thousands of times per move
 - Research optimizations techniques in more complex implementations such as Chess

## Sources 📕
 - [Minimax Implmenetation for Tic Tac Toe](http://blog.gamesolver.org/) - Great implementation of the algorithm in C++
 - [YouTube video explaining Minimax](https://www.youtube.com/watch?v=trKjYdBASyQ)
 - [Lowest Possible Moves](https://codegolf.stackexchange.com/questions/269682/possible-moves-in-othello-reversi) - This code wasn't used, but in my search for methods of implementing the getPossibleMoves() function, I found this thread of people implementing that function in as few bytes as possible in multiple languages (and in Google Sheets, funnily enough) 
