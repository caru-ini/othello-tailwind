import React from "react";
import { stoneType } from "./game";
// cell component
// tailwindcss classes

const stoneColor = [
  "",
  "bg-slate-600",
  "bg-white",
  "bg-sky-300 drop-shadow-none hover:cursor-pointer",
];

const stoneSizes = ["", "size-[80%]", "size-[80%]"];

const possibleColor = "bg-sky-300 drop-shadow-none hover:cursor-pointer";
const possibleSizes = "size-[40%]";

type CellProps = {
  variant: stoneType;
  possible: boolean;
  onClick: () => void;
};

const Cell: React.FC<CellProps> = ({ variant, possible, onClick }) => {
  return (
    <div
      className="flex justify-center items-center size-full bg-sky-100 aspect-square shadow-md rounded-md"
      onClick={onClick}
    >
      {variant !== 0 && (
        <div
          className={`shadow-xl aspect-square rounded-full ${
            stoneColor[variant as number]
          } ${stoneSizes[variant as number]}`}
        ></div>
      )}
      {possible && (
        <div
          className={`aspect-square rounded-full ${possibleColor} ${possibleSizes}`}
        ></div>
      )}
    </div>
  );
};
export default Cell;
