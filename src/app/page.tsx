import Game from "@/components/reversi/game";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col justify-center">
            {/* Reversi UI */}
            <div className="container flex items-center justify-center gap-10">
                <Game/>
                {/* Reversi Game */}
            </div>
        </main>
    );
}
