type Difficulty = "easy" | "hard" | "crazy";

type GameSetupPanelProps = {
  difficulty: Difficulty;
  isGenerating: boolean;
  error: string;
  onGenerate: (difficulty: Difficulty) => void;
};

const difficultyOptions: {
  label: string;
  value: Difficulty;
  description: string;
}[] = [
  {
    label: "Easy",
    value: "easy",
    description: "60% letters shown",
  },
  {
    label: "Hard",
    value: "hard",
    description: "40% letters shown",
  },
  {
    label: "Crazy",
    value: "crazy",
    description: "20% letters shown",
  },
];

export type { Difficulty };

export default function GameSetupPanel({
  isGenerating,
  error,
  onGenerate,
}: GameSetupPanelProps) {
  return (
    <div className="shrink-0 mb-6 py-4 sm:py-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {difficultyOptions.map((item) => (
          <button
            key={item.value}
            onClick={() => onGenerate(item.value)}
            disabled={isGenerating}
            className={`text-left rounded-xl border-2 border-black p-4 cursor-pointer active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition w-full sm:w-auto sm:min-w-[190px] lg:w-[250px] shadow-[3px_3px_0_#000] active:shadow-none ${
              item.value === "easy"
                ? "bg-green-100 hover:bg-green-200"
                : item.value === "hard"
                  ? "bg-yellow-100 hover:bg-yellow-200"
                  : "bg-red-100 hover:bg-red-200"
            }`}
          >
            <p className="text-xl sm:text-2xl font-bold">{item.label}</p>

            <p className="text-base sm:text-lg">{item.description}</p>
          </button>
        ))}
      </div>

      {error && <p className="mt-4 font-medium text-red-600">{error}</p>}
    </div>
  );
}
