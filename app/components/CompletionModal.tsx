type CompletionModalProps = {
  open: boolean;
  difficulty: string;
  theme: string;
  onPlayAgain: () => void;
};

export default function CompletionModal({
  open,
  difficulty,
  theme,
  onPlayAgain,
}: CompletionModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[90%] max-w-md rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0_#000]">
        <h2 className="text-4xl font-black mb-4 text-center">🎉 Completed!</h2>

        <div className="space-y-2 text-center mb-6">
          <p className="text-xl font-semibold">
            Difficulty: {difficulty.toUpperCase()}
          </p>

          <p className="text-xl font-semibold">Theme: {theme}</p>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full rounded-xl border-2 border-black bg-green-400 py-3 text-xl font-bold shadow-[4px_4px_0_#000] transition hover:bg-green-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
