// How many moves deep the algorithm analyzes (Not optimized for more than 9)
const MAX_DEPTH = 9;


//Lists each possible direction
const directions = [
  [0, 1],  [1, 0],  [0, -1], [-1, 0],
  [1, 1],  [1, -1], [-1, 1], [-1, -1],
]

//A hashmap containing key value pairs of [boardState, Move] = Solution
const calculatedMoves = new Map();

/**
  * Calculates the best possible move for the given player
  * for the given board state
  *
  * @param {string} player
  * @param {board}  board
  *
  * @return [x, y]
*/
function getMove(player, board) {
  const moves = getPossibleMoves(board, player);
  let bestMove = null;
  let bestScore = -Infinity;
  let alpha = -Infinity; // For alpha beta pruning
  const beta = Infinity; // For alpha beta pruning

  for (let move of moves) {
    const searchMove = calculatedMoves.get([board, move]);
    let moveScore = null;

    // Only perform minimax if the move being considered has not been calculated yet
    if (searchMove !== undefined) {
      moveScore = searchMove;
    }
    else {
      moveScore = minimax(
        simulateMove(board, move, player),
        MAX_DEPTH, 
        player,
        false,
        alpha,
        beta
      );
      // Records move in hashmap
      calculatedMoves.set([board, move], moveScore);
    }

    
    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMove = move;
    }
    alpha = Math.max(alpha, bestScore);
  }

  //console.log(`Playing the move: ${bestMove} with score: ${bestScore}`);
  return bestMove;
}


/**
 * Minimax algorithm for evaluating board position
 *
 * @param {board}   board
 * @param int       depth       - Keeps track of how many layers recursively that minimax has called itself
 * @param {player}  player      - Always the original player being calculated for
 * @param boolean   isOpponent  - Boolean flips back and forth depending on if calculating Player or Opponent
 * @param float     alpha       - Score ceiling for alpha-beta pruning
 * @param float     beta        - Score floor for alpha-beta pruning
 *
 * @returns int - The score for the given branch of moves
*/
function minimax(board, depth, player, isOpponent, alpha, beta) {
  if (depth === 0) 
    return evaluatePosition(board, player);

  const currentPlayer = isOpponent ? getOpponent(player) : player;
  const moves = getPossibleMoves(board, currentPlayer);
  
  if (moves.length === 0) {
    // If no moves, check if opponent can move
    const opponentMoves = getPossibleMoves(board, getOpponent(currentPlayer));
    if (opponentMoves.length === 0) {
      // Game is over, count pieces
      let finalScore = evaluatePosition(board, player);
      if (finalScore > 0)
        return 99999 * depth; // This optimizes for quicker wins as opposed to just getting more pieces
      else if (finalScore < 0)
        return -9999;
      else
        return 0;
    }
    // Skip turn
    return minimax(board, depth - 1, player, !isOpponent, alpha, beta);
  }

  let bestScore;
  
  if (!isOpponent) {
    bestScore = -Infinity;
    for (let move of moves) {
      //console.log(`Simulating move (${move}) at depth ${depth}\n`)
      const score = minimax(
        simulateMove(board, move, currentPlayer),
        depth - 1,
        player,
        true,
        alpha,
        beta
      );
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);
      
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
  } else {
    bestScore = Infinity;
    for (let move of moves) {
      //console.log(`Simulating move (${move}) at depth ${depth}\n`)
      const score = minimax(
        simulateMove(board, move, currentPlayer),
        depth - 1,
        player,
        false,
        alpha,
        beta
      );
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, bestScore);
      
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
  }
  
  return bestScore;
}


/**
 * Returns a copy of the board as if a specific move has been played
 *
 * @param {board}   board
 * @param [x, y]    move
 * @param {player}  player
 *
 * @returns {board}
*/
function simulateMove(board, move, player) {
  //console.log(`SIMULATING MOVE ${move}`);
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
 * Returns a score of how many pieces more that {player} has than 
 * their opponent
 *
 * @param {board}  board
 * @param {player} player
 *
 * @returns int - Score for a given player
*/
function evaluatePosition(board, player) {
  let score = 0;
  
  // Position evaluation
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === player)
        score++; 
      else if (board[i][j] !== 0)
        score--;
    }
  }

  return score;
}

/**
  * Looks for all possible moves that {player} has available
  *
  * @param {board} board
  * @param {player} player
  *
  * @returns moves[] 
  */
function getPossibleMoves(board, player) {
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
  *
  * @param {player} player
  * 
  * @returns {player}
*/
function getOpponent(player) {
  if (player === 1)
    return 2;
  else
    return 1;
}

/**
  * Returns if a given square can be played
  *
  * @param {board} board
  * @param {player} player
  * @param int x - The x position of the move being attempted
  * @param int y - The y position of the move being attempted
  *
  * @returns boolean
*/
function isValidMove(board, player, x, y) {
  //console.log(`Checking if move (${x}, ${y}) is valid...`)
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

module.exports = {getMove, prepareResponse, getPossibleMoves, evaluatePosition, simulateMove};
