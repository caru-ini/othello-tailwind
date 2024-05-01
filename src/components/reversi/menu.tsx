import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";
import { stoneType } from "./game";

interface menuProps {
  onReset: () => void;
  player: stoneType;
  count: [number, number];
}

const Menu = ({ onReset, player, count }: menuProps) => {
  const playerColor = ["", "bg-slate-600", "bg-white"];
  return (
    <div className="flex flex-col justify-between gap-2 border border-border p-5 rounded-md bg-sky-100">
      <div className="flex md:justify-between items-center gap-3">
        <div
          className={`aspect-square rounded-full drop-shadow-md w-12 ${playerColor[player]}`}
        ></div>
        {/* title */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">
            <span className="text-cyan-500">INIAD</span>.ts
          </h1>
          <h1 className="text-2xl font-bold">Reversi</h1>
        </div>
      </div>
      <div className="flex gap-5 items-center justify-evenly">
        <Button variant={"ghost"} className="px-2" onClick={onReset}>
          <RotateCcw />
        </Button>
        {/* count */}
        <div className="flex gap-3 flex-grow">
          <div className="flex gap-1">
            <div className="w-2 rounded-full drop-shadow-md bg-slate-600" />
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold">Black</h1>
              <h1 className="text-lg">{count[0]}</h1>
            </div>
          </div>
          <div className="flex gap-1">
            <div className="w-2 rounded-full drop-shadow-md bg-white" />
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold">White</h1>
              <h1 className="text-lg">{count[1]}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
