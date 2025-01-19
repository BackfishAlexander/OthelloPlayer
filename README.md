# Alex Backfish Othello Solution

## Getting Started 🚀
Make sure you have the required npm package(s) installed: `npm install`
To run the client: `node client.js [optional port] [optional hostname]`

To run all tests, run `npm run test`

## Software Versions
* Node 8.12.0
* NPM 6.8.0

## Solution Explained
The solution I have implemented uses an algorithm called minimax. Minimax recursively makes a tree containing every possible move and the score of the resulting board from that move. It can be tweaked with various depths to determine how many moves ahead it checks.

## Sources
[Lowest Possible Moves](https://codegolf.stackexchange.com/questions/269682/possible-moves-in-othello-reversi) - This code wasn't used, but in my search for methods of implementing the getPossibleMoves() function, I found this thread of people implementing that function in as few bytes as possible in multiple languages (and in Google Sheets, funnily enough) 


