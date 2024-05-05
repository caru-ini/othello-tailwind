"use client";
import React from "react";
import Board from "./board";
import Menu from "./menu";

export type stoneType = 0 | 1 | 2 | 3; // 0: null, 1: black, 2: white, 3: possible
export type playerType = 0 | 1 | 2 | 3 | 4; // 0: draw 1: black, 2: white, 3: black win, 4: white win

const defaultBoard: stoneType[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0],
  [0, 0, 3, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 2, 3, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

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
  const result = { foundOpponent: false, x: col + dx, y: row + dy };

  // scan in the provided direction
  while (true) {
    const currentStone = board[result.y]?.[result.x];
    if (!currentStone || currentStone === player) {
      break;
    }
    result.foundOpponent = true;
    result.x += dx;
    result.y += dy;
  }

  return result;
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

  directions.forEach((direction) => {
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
      const flip = [col + dx, row + dy];

      while (true) {
        if (newBoard[flip[1]][flip[0]] === player) break;
        newBoard[flip[1]][flip[0]] = player;
        flip[0] += dx;
        flip[1] += dy;
      }
    }
  });

  newBoard[row][col] = player as stoneType;
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

const shouldSkip = (board: stoneType[][], player: playerType): boolean => {
  return !Boolean(getCount(board)[3]);
};

const getCount = (board: stoneType[][]): [number, number, number, number] => {
  return board.flat().reduce(
    (acc, cur) => {
      acc[cur]++;
      return acc;
    },
    [0, 0, 0, 0] as [number, number, number, number]
    // 0: null, 1: black, 2: white, 3: available
  );
};

const Game: React.FC = () => {
  const [board, setBoard] = React.useState(defaultBoard);
  const [player, setPlayer] = React.useState<playerType>(1);

  const count = getCount(board);

  const clickHandler = (x: number, y: number) => {
    if (board[y][x] !== 3) return;
    const newBoard = flipStones(getCleanBoard(board), player, x, y);
    updateValidMoves(newBoard, (2 / player) as playerType);

    // if no valid moves, check next next player has valid moves
    const nextPlayer = (2 / player) as playerType;

    const determineWinner = () => {
      const [black, white] = count.slice(1, 3);
      const winner = [4, 3, 0][
        +(black >= white) + +(black === white)
      ] as playerType;
      setPlayer(winner);
    };

    const shouldSkipNextPlayer = shouldSkip(newBoard, nextPlayer);
    if (shouldSkipNextPlayer) {
      updateValidMoves(newBoard, player);
    }
    const shouldSkipExtraPlayer = shouldSkip(newBoard, player);
    if (shouldSkipExtraPlayer && shouldSkipNextPlayer) {
      determineWinner();
      setBoard(newBoard);
      return;
    }
    setPlayer(shouldSkipNextPlayer ? player : nextPlayer);
    setBoard(newBoard);
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
