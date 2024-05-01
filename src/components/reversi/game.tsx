"use client";
import React from "react";
import Board from "./board";
import Menu from "./menu";

export type stoneType = 0 | 1 | 2 | 3; // 0: null, 1: black, 2: white, 3: possible

const defaultBoard: stoneType[][] = Array.from({ length: 8 }, () =>
  Array(8).fill(0)
);
defaultBoard[3][4] = 1;
defaultBoard[4][3] = 1;
defaultBoard[3][3] = 2;
defaultBoard[4][4] = 2;
defaultBoard[3][2] = 3;
defaultBoard[2][3] = 3;
defaultBoard[5][4] = 3;
defaultBoard[4][5] = 3;

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
): { foundOpponent: boolean; x: number; y: number } => {
  let x = col + dx;
  let y = row + dy;
  let foundOpponent = false;

  while (true) {
    const currentStone = board[y]?.[x];
    if (
      currentStone === undefined ||
      currentStone === 0 ||
      currentStone === player
    ) {
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
  row: number
): boolean => {
  if (board[row][col] !== 0) {
    return false;
  }

  for (const direction of directions) {
    const [dx, dy] = direction;
    const { foundOpponent, x, y } = findStonesInDirection(
      board,
      player,
      col,
      row,
      dx,
      dy
    );

    if (foundOpponent && board[y]?.[x] === player) {
      return true;
    }
  }

  return false;
};

const getAllValidMoves = (
  board: stoneType[][],
  player: stoneType
): boolean[][] => {
  const validMoves = Array.from({ length: 8 }, () => Array(8).fill(false));

  let x = 0;
  let y = 0;

  while (y < 8) {
    x = 0;
    while (x < 8) {
      validMoves[y][x] = isValidMove(board, player, x, y);
      x++;
    }
    y++;
  }

  return validMoves;
};

const flipStones = (
  board: stoneType[][],
  player: stoneType,
  col: number,
  row: number
): stoneType[][] => {
  const newBoard = structuredClone(board);

  for (const direction of directions) {
    const [dx, dy] = direction;
    const { foundOpponent, x, y } = findStonesInDirection(
      board,
      player,
      col,
      row,
      dx,
      dy
    );

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
};

const getCleanBoard = (board: stoneType[][]): stoneType[][] => {
  // get board that filtered 3
  return board.map((row) => row.map((cell) => (cell === 3 ? 0 : cell)));
};

const updateValidMoves = (board: stoneType[][], player: stoneType) => {
  const validMoves = getAllValidMoves(board, player);
  validMoves.forEach((row, y) => {
    row.forEach((valid, x) => {
      if (valid) {
        board[y][x] = 3;
      }
    });
  });
};

const Game: React.FC = () => {
  // two dimensional [8][8] array
  const [board, setBoard] = React.useState(defaultBoard);
  // current player
  const [player, setPlayer] = React.useState<stoneType>(1);
  // winner
  const [winner, setWinner] = React.useState<stoneType | null>(null);

  const count = board.flat().reduce(
    (acc, stone) => {
      if (stone === 1) acc[0]++;
      else if (stone === 2) acc[1]++;
      return acc;
    },
    [0, 0] as [number, number]
  );

  const clickHandler = (x: number, y: number) => {
    if (board[y][x] !== 3) return;
    const newBoard = flipStones(getCleanBoard(board), player, x, y);
    newBoard[y][x] = player;
    updateValidMoves(newBoard, (2 / player) as stoneType);
    console.log(newBoard);
    setBoard(newBoard);
    setPlayer((2 / player) as stoneType);
  };

  const reset = () => {
    const newBoard = structuredClone(defaultBoard);
    setBoard(newBoard);
    setPlayer(1);
    setWinner(null);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-5 p-5 rounded-md border border-border size-full">
      <div className="flex flex-col gap-5 justify-center">
        <Menu onReset={() => reset()} player={player} count={count} />
      </div>
      <Board board={board} onClick={clickHandler} />
    </div>
  );
};

export default Game;
