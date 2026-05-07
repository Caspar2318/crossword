import { CrosswordCell, PlacedWord } from "@/lib/crossword";
import { Difficulty } from "./GameSetupPanel";

type GameStatusBarProps = {
  difficulty: Difficulty;
  grid: CrosswordCell[][];
  placedWords: PlacedWord[];
  answers: Record<string, string>;
  revealedCells: Set<string>;
};

export default function GameStatusBar({
  difficulty,
  grid,
  placedWords,
  answers,
  revealedCells,
}: GameStatusBarProps) {
  const playableCells = grid.flat().filter((cell) => !cell.isEmpty);
  const filledCount = playableCells.filter((cell) => {
    const key = `${cell.row}-${cell.col}`;
    return revealedCells.has(key) || Boolean(answers[key]);
  }).length;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <StatusItem label="Difficulty" value={difficulty.toUpperCase()} />
      <StatusItem label="Words" value={placedWords.length} />
      <StatusItem
        label="Filled"
        value={`${filledCount}/${playableCells.length}`}
      />
    </div>
  );
}

function StatusItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border-2 border-black bg-white px-3 py-2 shadow-[3px_3px_0_#000] text-black">
      <span className="mr-2 text-sm font-semibold">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
