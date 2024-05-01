import React from "react";
import { stoneType } from "./game";

const stoneStyles = [
  "",
  "bg-slate-600 size-[75%] shadow-xl",
  "bg-white size-[75%] shadow-xl",
  "bg-sky-300 drop-shadow-none hover:cursor-pointer size-[30%]",
];

type CellProps = {
  variant: stoneType;
  onClick: () => void;
};

const Cell: React.FC<CellProps> = ({ variant, onClick }) => {
  return (
    <div
      className="flex justify-center items-center size-full bg-sky-100 aspect-square shadow-md rounded-md"
      onClick={onClick}
    >
      {
        <div
          className={`aspect-square rounded-full ${
            stoneStyles[variant as number]
          }`}
        ></div>
      }
    </div>
  );
};
export default Cell;
