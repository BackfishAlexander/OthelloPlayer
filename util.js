const directions = [
  [0, 1],  [1, 0],  [0, -1], [-1, 0],
  [1, 1],  [1, -1], [-1, 1], [-1, -1],
]

/**
  * Calculates the best possible move for the given player
  * for the given board state
  * @param {string} player
  * @param {board}  board
  * @return [x, y]
*/
function getMove(player, board) {
  console.log("GETTING BEST MOVE...");
  const moves = getPossibleMoves(board, player);
  let bestMove = null;
  let bestScore = -9999;

  for (let move of moves) {
    const moveScore = minimax(
      simulateMove(board, move, player),
      10,
      player,
      false
    )

    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMove = move;
    }
  }

  console.log(`Playing the move: ${bestMove}`)
  return bestMove;
}

/**
 * Minimax algorithm for evaluating boar position
*/
function minimax(board, depth, player, isOpponent=false) {
  console.log(`RUNNING MINIMAX AT DEPTH ${depth}`);
  const score = evaluatePosition(board, player)
  if (depth === 0)
    return score;

  const moves = getPossibleMoves(board, player);
  if (moves.length === 0)
    return score;

  if (isOpponent) {
    let maxScore = -9999;
    let currentScore = 0;

    moves.forEach((move) => {
      currentScore = minimax(
        simulateMove(board, move, getOpponent(player)),
        depth - 1,
        player,
        true
      );
      maxScore = Math.max(maxScore, currentScore);
    })

    return maxScore;
  }
  else {
    let minScore = 9999;
    let currentScore = 0;
    moves.forEach((move) => {
      currentScore = minimax(
        simulateMove(board, move, player),
        depth - 1,
        player,
        false
      )
    minScore = Math.min(minScore, currentScore);
    });
  
  return minScore;
  }
}

/**
 * Returns a copy of the board if the player made the given move
*/
function simulateMove(board, move, player) {
  console.log(`SIMULATING MOVE ${move}`);
  const clonedBoard = board.map(row => row.slice());
  const opponent = getOpponent(player);
  clonedBoard[move[0]][move[1]] = player;

  for (let [dx, dy] of directions) {
    let i = move[0] + dx;
    let j = move[1] + dy;
    const piecesToFlip = [];

    while (i >= 0 && i < 8 && j >= 0 && j < 8 && board[i][j] === opponent) {
      piecesToFlip.push([i, j]);
      i += dx;
      j += dy;
    }

    if (i >= 0 && i < 8 && j >= 0 && j < 8 && board[i][j] === player) {
      for (let pieces of piecesToFlip) {
        clonedBoard[pieces[0]][pieces[1]] = player;
      }
    }

  }

  return clonedBoard;
}

/**
 * Returns a score of how well {player} is doing
 * Higher is better, lower is worse
*/
function evaluatePosition(board, player) {
  console.log("Evaluating position...");
  let count = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === player)
        count++;
      else if (board[i][j] === 0)
        continue;
      else
        count--;
    }
  }
  return count;
}



/**
  * Looks for all possible  moves on the board
  *
  */
function getPossibleMoves(board, player) {
  console.log("Getting possible moves...");
  const moves = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (isValidMove(board, player, i, j)) {
        moves.push([i, j]);
      }
    }
  }
  //console.log(moves);
  return moves;
}

/**
  * Returns the opposite player
*/
function getOpponent(player) {
  if (player === 1)
    return 2;
  else
    return 1;
}

/**
  * Returns if a given square can be played
*/
function isValidMove(board, player, x, y) {
  console.log(`Checking if move (${x}, ${y}) is valid...`)
  if (board[x][y] !== 0)
    return false;

  const opponent = getOpponent(player);

  for (let [dx, dy] of directions) {
    let i = x + dx; //Moving in the x direction
    let j = y + dy; //Moving in the y direction
    let opponentFound = false; //If the given direction has found an opponent piece to hop over yet

    while (i >= 0 && j >= 0 && i < 8 && j < 8) {
      if (board[i][j] === opponent) {
        opponentFound = true;
      } else if (board[i][j] === player) {
        if (opponentFound)
          return true;
        break;
      } else {
        break;
      }

      i += dx;
      j += dy
    }
  }

  return false;
}

function prepareResponse(move) {
  const response = `${JSON.stringify(move)}\n`;
  //console.log(`Sending response ${response}`);
  return response;
}

module.exports = {getMove, prepareResponse, getPossibleMoves};
