import { VocabWord } from "@/types/word";
import { AiTwotoneSound } from "react-icons/ai";

type WordListModalProps = {
  open: boolean;
  words: VocabWord[];
  onClose: () => void;
  onPlayWord: (word: string, audioUrl?: string) => void;
};

export default function WordListModal({
  open,
  words,
  onClose,
  onPlayWord,
}: WordListModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/30 p-4">
      <div className="flex max-h-[80vh] w-full max-w-3xl flex-col rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_#000]">
        <div className="flex items-center justify-between border-b-2 border-black px-5 py-4">
          <div>
            <h2 className="text-2xl font-black italic">Vocabulary List</h2>
            <p className="text-lg">{words.length} words</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border-2 border-black bg-red-100 px-3 py-1 font-bold shadow-[2px_2px_0_#000] hover:bg-red-200 active:translate-y-0.5 active:shadow-none"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="grid gap-3">
            {words.map((item, index) => (
              <div
                key={`${item.word}-${index}`}
                className="rounded-2xl border-2 border-black bg-green-100 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-2xl font-black text-black">{item.word}</p>

                  {"phonetic" in item && item.phonetic && (
                    <p className="text-lg font-semibold text-slate-600">
                      {item.phonetic}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      onPlayWord(
                        item.word,
                        "audioUrl" in item ? item.audioUrl : undefined,
                      )
                    }
                    className="active:translate-y-0.5 cursor-pointer"
                  >
                    <AiTwotoneSound size={24} />
                  </button>
                </div>

                <p className="mt-2 text-lg text-slate-800">
                  <span className="font-bold">Definition: </span>
                  {item.definition || "Not available yet"}
                </p>

                {item.clue && (
                  <p className="mt-1 text-md text-slate-800">
                    <span className="font-bold">Clue: </span>
                    {item.clue}
                  </p>
                )}

                {item.example && (
                  <p className="mt-1 text-md text-slate-800">
                    <span className="font-bold">Example: </span>
                    {item.example}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
