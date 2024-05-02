"use client";
import React from "react";
import Board from "./board";
import Menu from "./menu";

export type stoneType = 0 | 1 | 2 | 3; // 0: null, 1: black, 2: white, 3: possible
export type playerType = 0 | 1 | 2 | 3 | 4; // 0: draw 1: black, 2: white, 3: black win, 4: white win

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
  player: playerType,
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
  player: playerType,
  col: number,
  row: number
): number => {
  board = getCleanBoard(board);
  if (board[row][col] !== 0) {
    return board[row][col];
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
      return 3;
    }
  }

  return board[row][col];
};

const flipStones = (
  board: stoneType[][],
  player: playerType,
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
  const trans = [0, 1, 2, 0];
  // get board that filtered 3
  return board.map((row) => row.map((cell) => trans[cell] as stoneType));
};

const updateValidMoves = (board: stoneType[][], player: playerType) => {
  board.forEach((row, y) => {
    row.forEach((_, x) => {
      board[y][x] = isValidMove(board, player, x, y) as stoneType;
    });
  });
};

const Game: React.FC = () => {
  // two dimensional [8][8] array
  const [board, setBoard] = React.useState(defaultBoard);
  // current player
  const [player, setPlayer] = React.useState<playerType>(1);

  const count = board.flat().reduce(
    (acc, cur) => {
      acc[cur]++;
      return acc;
    },
    [0, 0, 0, 0] as [number, number, number, number]
  );

  const clickHandler = (x: number, y: number) => {
    if (board[y][x] !== 3) return;
    const newBoard = flipStones(getCleanBoard(board), player, x, y);
    newBoard[y][x] = player as stoneType;
    updateValidMoves(newBoard, (2 / player) as playerType);
    console.log(newBoard);
    // if no valid moves, check next next player has valid moves
    if (newBoard.flat().filter((cell) => cell === 3).length === 0) {
      updateValidMoves(newBoard, player);
      if (newBoard.flat().filter((cell) => cell === 3).length === 0) {
        let black = count[1];
        let white = count[2];
        console.log(black > white);
        if (black > white) {
          setPlayer(3);
          setBoard(newBoard);
          return;
        } else if (black < white) {
          setPlayer(4);
          setBoard(newBoard);
          return;
        }
        setPlayer(0);
        setBoard(newBoard);
        return;
      }
      setPlayer((2 / player) as playerType);
      setBoard(newBoard);
      return;
    }
    setBoard(newBoard);
    setPlayer((2 / player) as playerType);
  };

  const reset = () => {
    const newBoard = structuredClone(defaultBoard);
    setBoard(newBoard);
    setPlayer(1);
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
