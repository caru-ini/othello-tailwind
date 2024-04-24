"use client";
import React  from "react";
import Board from "./board";
import Menu from "./menu";

export type stoneType = 0 | 1 | 2 | 3; // 0: null, 1: black, 2: white, 3: possible


const defaultBoard: stoneType[][] = Array.from({ length: 8 }, () => Array(8).fill(0));
defaultBoard[3][4] = 1;
defaultBoard[4][3] = 1;
defaultBoard[3][3] = 2;
defaultBoard[4][4] = 2;

const directions = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

const findStonesInDirection = (
  board: stoneType[][],
  player: stoneType,
  col: number,
  row: number,
  dx: number,
  dy: number
): { foundOpponent: boolean, x: number, y: number } => {
  let x = col + dx;
  let y = row + dy;
  let foundOpponent = false;

  while (x >= 0 && x < 8 && y >= 0 && y < 8) {
    const currentStone = board[y][x];

    if (currentStone === 0) {
      break;
    }

    if (currentStone === player) {
      break;
    }

    foundOpponent = true;
    x += dx;
    y += dy;
  }

  return { foundOpponent, x, y };
};

const isValidMove = (
  board: stoneType[][],
  player: stoneType,
  col: number,
  row: number,
): boolean => {
  if (board[row][col] !== 0) {
    return false;
  }

  for (const direction of directions) {
    const [dx, dy] = direction;
    const { foundOpponent, x, y } = findStonesInDirection(board, player, col, row, dx, dy);

    if (foundOpponent && board[y]?.[x] === player) {
      return true;
    }
  }

  return false;
};

const getAllValidMoves = (board: stoneType[][], player: stoneType): boolean[][] => {
  const validMoves = Array.from({ length: 8 }, () => Array(8).fill(false));

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      validMoves[y][x] = isValidMove(board, player, x, y);
    }
  }

  return validMoves;
};

const flipStones = (board: stoneType[][], player: stoneType, col: number, row: number): stoneType[][] => {
  const newBoard = [...board];

  for (const direction of directions) {
    const [dx, dy] = direction;
    const { foundOpponent, x, y } = findStonesInDirection(board, player, col, row, dx, dy);

    if (foundOpponent && board[y]?.[x] === player) {
      let flipX = col + dx;
      let flipY = row + dy;

      while (flipX !== x || flipY !== y) {
        newBoard[flipY][flipX] = player;
        flipX += dx;
        flipY += dy;
      }
    }
  }

  return newBoard;
}

const Game: React.FC = () => {
  // two dimensional [8][8] array
  const [board, setBoard] = React.useState(defaultBoard);
  // current player
  const [player, setPlayer] = React.useState<stoneType>(1);
  // winner
  const [winner, setWinner] = React.useState<stoneType | null>(null);

  const count = board.flat().reduce((acc, stone) => {
    if (stone === 1) acc.black++;
    else if (stone === 2) acc.white++;
    return acc;
  }, { black: 0, white: 0 });
  
  const [possibleMoves, setPossibleMoves] = React.useState<boolean[][]>(getAllValidMoves(board, 1));
  const clickHandler = (x: number, y: number) => {
    if (!isValidMove(board, player, x, y)) {
      return;
    }
    const newBoard = flipStones([...board], player, x, y);
    newBoard[y][x] = player;
    setBoard(newBoard);
    setPlayer((3 - player) as stoneType);
    setPossibleMoves(getAllValidMoves(newBoard, (3 - player) as stoneType));
  };

  const reset = () => {
    setBoard(defaultBoard);
    setPossibleMoves(getAllValidMoves(defaultBoard, 1));
    setPlayer(1);
    setWinner(null);
  }


  return (
    <div className="flex flex-col md:flex-row justify-between gap-5 p-5 rounded-md border border-border size-full">
      <div className="flex flex-col gap-5 justify-center">
        <Menu onReset={() => reset()} player={player} count={count} />
      </div>
      <Board board={board} possibleMoves={possibleMoves} onClick={clickHandler} />
    </div>
  );
};

export default Game;
