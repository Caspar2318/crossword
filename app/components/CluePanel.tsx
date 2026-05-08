import { PlacedWord } from "@/lib/crossword";
import { useState } from "react";
import { AiTwotoneSound } from "react-icons/ai";
import {
  FaLongArrowAltRight,
  FaLongArrowAltDown,
  FaHandPointRight,
} from "react-icons/fa";

type CluePanelProps = {
  placedWords: PlacedWord[];
  isCompleted: boolean;
  selectedWord: PlacedWord | null;
  onSelectWord: (word: PlacedWord) => void;
  onCloseWord: () => void;
  onPlayWord: (word: string) => void;
};

export default function CluePanel({
  placedWords,
  isCompleted,
  selectedWord,
  onSelectWord,
  onCloseWord,
  onPlayWord,
}: CluePanelProps) {
  const [hintWordKey, setHintWordKey] = useState<string | null>(null);

  return (
    <aside className="w-full lg:w-[400px] lg:h-full min-h-0">
      <div className="h-full rounded-2xl p-0 sm:p-5 flex flex-col">
        <div className="shrink-0 mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Clues</h2>
        </div>

        <div className="min-h-0 lg:flex-1 overflow-y-visible lg:overflow-y-auto pr-0 lg:pr-1 space-y-2">
          {placedWords.map((item, index) => (
            <div
              key={item.word}
              className="w-full rounded-xl transition border-2 border-black bg-white"
            >
              <div className="flex items-start gap-2 px-3 sm:px-4 py-2">
                <button
                  onClick={() => {
                    if (isCompleted) {
                      onSelectWord(item);
                    }
                  }}
                  className={`flex-1 text-left ${
                    isCompleted ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 font-semibold text-lg sm:text-xl">
                      {index + 1}.
                    </span>

                    <span className="shrink-0 pt-1">
                      {item.direction === "across" ? (
                        <FaLongArrowAltRight
                          size={24}
                          className="text-red-500 sm:size-7"
                        />
                      ) : (
                        <FaLongArrowAltDown
                          size={24}
                          className="text-red-500 sm:size-7"
                        />
                      )}
                    </span>

                    <span className="font-semibold text-base sm:text-md leading-6">
                      {isCompleted ? item.word : item.definition}
                    </span>
                  </div>
                </button>

                {!isCompleted && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onPlayWord(item.word)}
                      className="shrink-0 cursor-pointer active:translate-y-0.5"
                    >
                      <AiTwotoneSound size={22} />
                    </button>

                    <button
                      onClick={() =>
                        setHintWordKey((prev) =>
                          prev === item.word ? null : item.word,
                        )
                      }
                      className="shrink-0 cursor-pointer active:translate-y-0.5 text-lg"
                    >
                      <FaHandPointRight size={19} />
                    </button>
                  </div>
                )}
              </div>

              {hintWordKey === item.word && (
                <div className="mb-1 px-3 sm:px-10 text-sm sm:text-base font-semibold space-y-2">
                  <div className="flex gap-4 text-red-500">
                    {item.partOfSpeech && (
                      <p className="capitalize">{item.partOfSpeech};</p>
                    )}

                    <p>First letter: {item.word[0].toUpperCase()}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {isCompleted && selectedWord && (
          <div className="shrink-0 mt-4 rounded-xl border border-blue-500 bg-blue-50 p-4 relative">
            <button
              onClick={onCloseWord}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white hover:bg-slate-100 text-black flex items-center justify-center border border-black cursor-pointer"
              aria-label="Close word card"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-1 pr-8">
              {selectedWord.word}
            </h3>

            {selectedWord.phonetic && (
              <p className="text-slate-500 mb-2">{selectedWord.phonetic}</p>
            )}

            <p className="text-base mb-4">{selectedWord.definition}</p>

            <button
              onClick={() => onPlayWord(selectedWord.word)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400 transition cursor-pointer"
            >
              Play pronunciation
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
