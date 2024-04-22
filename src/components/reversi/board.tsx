import React from "react";
import Cell from "./cell";
import { stoneType } from "./game";

interface BoardProps {
  board: stoneType[][];
  possibleMoves: boolean[][];
  onClick: (col: number, row: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, possibleMoves , onClick }) => {
  return (
    <div className="grid grid-cols-8 gap-2 h-full md:w-[60vmin] flex-grow">
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            variant={square}
            possible={possibleMoves[rowIndex][colIndex] && true}
            onClick={() => onClick(colIndex, rowIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Board;
