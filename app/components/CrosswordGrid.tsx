import { CrosswordCell, PlacedWord } from "@/lib/crossword";

type AnswerStatus = "idle" | "correct" | "wrong";

type CrosswordGridProps = {
  grid: CrosswordCell[][];
  placedWords: PlacedWord[];
  answers: Record<string, string>;
  revealedCells: Set<string>;
  submitted: boolean;
  isCompleted: boolean;
  selectedCellKey: string | null;
  onSelectCell: (key: string, position: { top: number; left: number }) => void;
  onAnswerChange: (key: string, value: string) => void;
};

export default function CrosswordGrid({
  grid,
  placedWords,
  answers,
  revealedCells,
  submitted,
  isCompleted,
  selectedCellKey,
  onSelectCell,
  onAnswerChange,
}: CrosswordGridProps) {
  const usedCells = grid.flat().filter((cell) => !cell.isEmpty);

  if (usedCells.length === 0) return null;

  const rows = usedCells.map((cell) => cell.row);
  const cols = usedCells.map((cell) => cell.col);

  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);

  const croppedGrid: CrosswordCell[][] = [];

  for (let row = minRow; row <= maxRow; row++) {
    const currentRow: CrosswordCell[] = [];

    for (let col = minCol; col <= maxCol; col++) {
      currentRow.push(grid[row][col]);
    }

    croppedGrid.push(currentRow);
  }

  const totalCols = maxCol - minCol + 1;
  const cellSizeClass = "w-12 h-12";

  function getCellStatus(cell: CrosswordCell): AnswerStatus {
    if (!submitted) return "idle";

    const key = getCellKey(cell);
    const userAnswer = answers[key]?.toUpperCase() ?? "";

    if (revealedCells.has(key)) return "correct";
    if (userAnswer === cell.letter) return "correct";

    return "wrong";
  }

  function getCellNumber(cell: CrosswordCell) {
    const index = placedWords.findIndex(
      (word) => word.row === cell.row && word.col === cell.col,
    );

    if (index === -1) return null;

    return index + 1;
  }

  return (
    <div className="w-full overflow-x-auto py-2">
      <div
        className="inline-grid gap-1.5 mt-4 sm:mt-6 p-4 pl-6"
        style={{
          gridTemplateColumns: `repeat(${totalCols}, 3rem)`,
        }}
      >
        {croppedGrid.flat().map((cell) => {
          const key = getCellKey(cell);

          if (cell.isEmpty) {
            return <div key={key} className={cellSizeClass} />;
          }

          const isRevealed = revealedCells.has(key);
          const status = getCellStatus(cell);
          const cellNumber = getCellNumber(cell);

          const statusClass =
            status === "correct"
              ? "bg-white border-black text-green-600"
              : status === "wrong"
                ? "bg-white border-black text-red-600"
                : isRevealed
                  ? "bg-white border-black text-black"
                  : "bg-white border-black text-purple-600";

          return (
            <div
              key={key}
              onClick={(event) => {
                if (!isRevealed && !isCompleted) {
                  const rect = event.currentTarget.getBoundingClientRect();

                  onSelectCell(key, getKeyboardPosition(rect));
                }
              }}
              className={`relative ${cellSizeClass} flex items-center justify-center rounded-md border-2 text-lg sm:text-2xl font-semibold shadow-sm overflow-visible ${
                selectedCellKey === key ? "ring-2 sm:ring-4 ring-blue-400" : ""
              } ${statusClass}`}
            >
              {cellNumber && (
                <span className="absolute -top-2 -left-2 z-10 flex h-5 min-w-5 sm:h-6 sm:min-w-6 items-center justify-center rounded-full border-2 border-black bg-blue-100 text-sm sm:text-lg font-bold text-black">
                  {cellNumber}
                </span>
              )}

              {isRevealed || isCompleted ? (
                <span>{cell.letter}</span>
              ) : (
                <input
                  data-crossword-input="true"
                  value={answers[key] ?? ""}
                  onFocus={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();

                    onSelectCell(key, getKeyboardPosition(rect));
                  }}
                  onChange={(event) => {
                    const value = event.target.value
                      .replace(/[^a-zA-Z]/g, "")
                      .slice(-1)
                      .toUpperCase();

                    onAnswerChange(key, value);
                  }}
                  className="w-full h-full bg-transparent text-center outline-none uppercase cursor-pointer hover:bg-blue-50 transition"
                  maxLength={1}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getCellKey(cell: CrosswordCell) {
  return `${cell.row}-${cell.col}`;
}

function getKeyboardPosition(rect: DOMRect) {
  const keyboardWidth =
    window.innerWidth < 640 ? window.innerWidth * 0.92 : 320;

  return {
    top: Math.min(rect.bottom + 8, window.innerHeight - 220),
    left: Math.min(
      Math.max(12, rect.left),
      window.innerWidth - keyboardWidth - 12,
    ),
  };
}
