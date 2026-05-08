type WordItem = {
  id?: string;
  word: string;
  definition?: string | null;
  example?: string | null;
  phonetic?: string | null;
  audioUrl?: string | null;
};

type GameSetupPanelProps = {
  isGenerating: boolean;
  isImporting: boolean;
  error: string;
  wordInput: string;
  words: WordItem[];
  onWordInputChange: (value: string) => void;
  onImportWords: () => void;
  onGenerate: () => void;
  onViewWords: () => void;
  isLoadingWords: boolean;
};

export default function GameSetupPanel({
  isGenerating,
  isImporting,
  error,
  wordInput,
  words,
  onWordInputChange,
  onImportWords,
  onGenerate,
  onViewWords,
  isLoadingWords,
}: GameSetupPanelProps) {
  const hasWords = words.length > 0;

  const hasNewInput = wordInput.trim().length > 0;

  return (
    <div className="shrink-0 mb-6 py-4 sm:py-5 px-2 text-black">
      <div className="mb-5">
        {isLoadingWords ? (
          <p className="text-lg sm:text-xl font-semibold animate-pulse italic">
            Loading vocabulary list...
          </p>
        ) : hasWords ? (
          <p className="text-lg sm:text-xl font-semibold">
            Vocabulary list contains{" "}
            <span className="font-black">{words.length}</span> words.
          </p>
        ) : (
          <p className="text-lg sm:text-xl font-semibold">Add words to start</p>
        )}
        {!isLoadingWords && (
          <p className="text-md sm:text-base">
            Add 30–40 English words separated by spaces, commas, or new lines.
          </p>
        )}
      </div>

      {!isLoadingWords && (
        <textarea
          value={wordInput}
          onChange={(e) => onWordInputChange(e.target.value)}
          disabled={isImporting || isGenerating}
          placeholder={`apple
banana
environment
communication`}
          className="min-h-[240px] w-full resize-y rounded-xl border-2 border-black bg-blue-50 px-4 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-300 disabled:opacity-60 placeholder:text-slate-100"
        />
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {!isLoadingWords && (
          <button
            onClick={onImportWords}
            disabled={
              isLoadingWords || isImporting || isGenerating || !hasNewInput
            }
            className="rounded-xl border-2 border-black bg-blue-100 px-5 py-3 font-bold shadow-[3px_3px_0_#000] transition hover:bg-blue-200 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isImporting
              ? "Importing..."
              : hasWords
                ? "Replace Words"
                : "Import Words"}
          </button>
        )}

        {hasWords && (
          <button
            onClick={onGenerate}
            disabled={isLoadingWords || isGenerating || isImporting}
            className="rounded-xl border-2 border-black bg-green-100 px-5 py-3 font-bold shadow-[3px_3px_0_#000] transition hover:bg-green-200 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate Game"}
          </button>
        )}

        {hasWords && (
          <button
            onClick={onViewWords}
            disabled={isGenerating || isImporting}
            className="rounded-xl border-2 border-black bg-yellow-100 px-5 py-3 font-bold shadow-[3px_3px_0_#000] transition hover:bg-yellow-200 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            View Word List
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border-2 border-red-300 bg-red-100 px-4 py-3">
          <p className="font-semibold text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
