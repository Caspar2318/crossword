"use client";
import { useState } from "react";
import { VocabWord } from "@/types/word";
import { AiTwotoneSound } from "react-icons/ai";

type WordListModalProps = {
  open: boolean;
  words: VocabWord[];
  onClose: () => void;
  onPlayWord: (word: string, audioUrl?: string) => void;
  onUpdateDefinition: (id: string, definition: string) => Promise<void>;
};

export default function WordListModal({
  open,
  words,
  onClose,
  onPlayWord,
  onUpdateDefinition,
}: WordListModalProps) {
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const [draftDefinition, setDraftDefinition] = useState("");
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  if (!open) return null;

  const sortedWords = [...words].sort((a, b) => a.word.localeCompare(b.word));

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
            {sortedWords.map((item, index) => {
              const isEditing = editingWordId === item.id;
              const isSaving = savingId === item.id;

              return (
                <div
                  key={`${item.word}-${index}`}
                  className="rounded-2xl border-2 border-black bg-green-100 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-2xl font-black text-black">
                      {item.word}
                    </p>

                    {item.phonetic && (
                      <p className="text-lg font-semibold text-slate-600">
                        {item.phonetic}
                      </p>
                    )}

                    <button
                      onClick={() => onPlayWord(item.word, item.audioUrl)}
                      className="active:translate-y-0.5 cursor-pointer"
                    >
                      <AiTwotoneSound size={24} />
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="mt-3">
                      <label className="font-bold">Definition:</label>

                      <textarea
                        value={draftDefinition}
                        onChange={(e) => setDraftDefinition(e.target.value)}
                        className="mt-2 min-h-[100px] w-full rounded-xl border-2 border-black bg-white p-3 text-base outline-none focus:ring-2 focus:ring-blue-300"
                      />

                      {error && (
                        <p className="mt-2 font-semibold text-red-600">
                          {error}
                        </p>
                      )}

                      <div className="mt-3 flex gap-2">
                        <button
                          disabled={isSaving}
                          onClick={async () => {
                            if (!item.id) return;

                            const nextDefinition = draftDefinition.trim();

                            if (!nextDefinition) {
                              setError("Definition cannot be empty.");
                              return;
                            }

                            try {
                              setSavingId(item.id);
                              setError("");
                              await onUpdateDefinition(item.id, nextDefinition);
                              setEditingWordId(null);
                              setDraftDefinition("");
                            } catch (error) {
                              setError(
                                error instanceof Error
                                  ? error.message
                                  : "Failed to update definition.",
                              );
                            } finally {
                              setSavingId(null);
                            }
                          }}
                          className="rounded-lg border-2 border-black bg-green-200 px-3 py-1 font-bold hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </button>

                        <button
                          disabled={isSaving}
                          onClick={() => {
                            setEditingWordId(null);
                            setDraftDefinition("");
                            setError("");
                          }}
                          className="rounded-lg border-2 border-black bg-white px-3 py-1 font-bold hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-lg text-slate-800">
                      <span className="font-bold">Definition: </span>
                      {item.definition || "No definition available."}

                      {item.id && (
                        <button
                          onClick={() => {
                            setEditingWordId(item.id!);
                            setDraftDefinition(item.definition || "");
                            setError("");
                          }}
                          className="ml-3 rounded-lg border-2 border-black bg-yellow-100 px-2 py-0.5 text-sm font-bold hover:bg-yellow-200"
                        >
                          Edit
                        </button>
                      )}
                    </p>
                  )}

                  {item.example && (
                    <p className="mt-2 text-md text-slate-800">
                      <span className="font-bold">Example: </span>
                      {item.example}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
