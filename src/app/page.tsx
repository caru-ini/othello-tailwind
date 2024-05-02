import Game from "@/components/reversi/game";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center">
      {/* Reversi UI */}
      <div className="flex items-center justify-center gap-10 w-[90vmin]">
        <Game />
        {/* Reversi Game */}
      </div>
    </main>
  );
}
