"use client";
import { useEffect, useMemo, useState } from "react";
import { generateSimpleCrossword, PlacedWord } from "@/lib/crossword";
import confetti from "canvas-confetti";
import {
  CluePanel,
  CrosswordGrid,
  VirtualKeyboard,
  GameSetupPanel,
  GameStatusBar,
  CompletionModal,
} from "./components";
import { Difficulty } from "./components/GameSetupPanel";
import { fetchGameWords } from "@/lib/wordApi";
import { words as localWords } from "@/data/words";
import { VocabWord } from "@/types/word";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { IoIosArrowBack } from "react-icons/io";

export default function HomePage() {
  const [selectedWord, setSelectedWord] = useState<PlacedWord | null>(null);
  const [selectedCellKey, setSelectedCellKey] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [keyboardPosition, setKeyboardPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [showAnswer, setShowAnswer] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [crossword, setCrossword] = useState<ReturnType<
    typeof generateSimpleCrossword
  > | null>(null);
  const [restoredRevealedCells, setRestoredRevealedCells] =
    useState<Set<string> | null>(null);

  const revealedCells = useMemo(() => {
    if (!crossword) return new Set<string>();

    if (restoredRevealedCells) {
      return restoredRevealedCells;
    }

    return createRevealedCells(crossword.grid, difficulty);
  }, [crossword, difficulty, restoredRevealedCells]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  function getRandomWordCount() {
    return Math.floor(Math.random() * 11) + 8;
  }

  function handleAnswerChange(key: string, value: string) {
    setSubmitted(false);
    setIsCompleted(false);

    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleVirtualKeyPress(letter: string) {
    if (!selectedCellKey) return;

    handleAnswerChange(selectedCellKey, letter);
  }

  function handleVirtualBackspace() {
    if (!selectedCellKey) return;

    handleAnswerChange(selectedCellKey, "");
  }

  function handleToggleCheck() {
    if (!crossword) return;

    if (submitted) {
      setSubmitted(false);
      setIsCompleted(false);
      return;
    }

    let allCorrect = true;

    for (const row of crossword.grid) {
      for (const cell of row) {
        if (cell.isEmpty) continue;

        const key = `${cell.row}-${cell.col}`;

        if (revealedCells.has(key)) continue;

        const userAnswer = answers[key]?.toUpperCase() ?? "";

        if (userAnswer !== cell.letter) {
          allCorrect = false;
        }
      }
    }

    setSubmitted(true);
    setIsCompleted(allCorrect);

    if (allCorrect) {
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.65 },
      });

      setTimeout(() => {
        confetti({
          particleCount: 120,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
        });

        confetti({
          particleCount: 120,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
        });
      }, 200);
    }

    if (!allCorrect) {
      setSelectedWord(null);
    }
  }

  function handleSelectCell(
    key: string,
    position: { top: number; left: number },
  ) {
    setSelectedCellKey(key);
    setKeyboardPosition(position);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      const clickedKeyboard = target.closest('[data-virtual-keyboard="true"]');

      const clickedInput = target.closest('[data-crossword-input="true"]');

      if (!clickedKeyboard && !clickedInput) {
        setKeyboardPosition(null);
        setSelectedCellKey(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const puzzle = params.get("puzzle");

      if (!puzzle) return;

      const savedPuzzle = decodePuzzle(puzzle);

      if (!savedPuzzle) return;

      setDifficulty(savedPuzzle.difficulty);
      setCrossword(savedPuzzle.crossword);
      setRestoredRevealedCells(new Set(savedPuzzle.revealedCellKeys));
      setGameStarted(true);
      setShowAnswer(false);
      setAnswers({});
      setSubmitted(false);
      setIsCompleted(false);
      setSelectedWord(null);
      setSelectedCellKey(null);
      setKeyboardPosition(null);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleGenerateGame(nextDifficulty: Difficulty) {
    try {
      setDifficulty(nextDifficulty);
      setIsGenerating(true);
      setGenerateError("");

      const randomWordCount = getRandomWordCount();

      let gameWords;

      try {
        gameWords = await fetchGameWords(randomWordCount);
      } catch {
        gameWords = getRandomWords(localWords, randomWordCount);
      }

      if (gameWords.length < 3) {
        gameWords = getRandomWords(localWords, randomWordCount);
      }

      if (gameWords.length < 3) {
        throw new Error("Not enough words to generate crossword.");
      }

      const newCrossword = generateSimpleCrossword(gameWords);

      setCrossword(newCrossword);
      setGameStarted(true);
      setShowAnswer(false);
      setAnswers({});
      setSubmitted(false);
      setIsCompleted(false);
      setSelectedWord(null);
      setSelectedCellKey(null);
      setKeyboardPosition(null);
      setRestoredRevealedCells(null);
    } catch (error) {
      setGenerateError(
        error instanceof Error
          ? error.message
          : "Failed to generate crossword. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleResetGame() {
    setCrossword(null);
    setGameStarted(false);
    setShowAnswer(false);
    setAnswers({});
    setSubmitted(false);
    setIsCompleted(false);
    setSelectedWord(null);
    setSelectedCellKey(null);
    setKeyboardPosition(null);
    setRestoredRevealedCells(null);
  }

  function handleToggleAnswer() {
    setShowAnswer((prev) => !prev);

    setSelectedCellKey(null);
    setKeyboardPosition(null);
  }

  function handleNewGame() {
    handleGenerateGame(difficulty);
  }

  return (
    <main
      className="min-h-screen lg:h-screen lg:overflow-hidden overflow-y-auto text-slate-800 p-4 sm:p-6 lg:p-8"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(191,219,254,0.4) 0%, transparent 25%), radial-gradient(circle at 80% 25%, rgba(254,240,138,0.35) 0%, transparent 22%), radial-gradient(circle at 70% 80%, rgba(187,247,208,0.3) 0%, transparent 20%), #f8fafc",
      }}
    >
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        <header className="mb-4 shrink-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold italic">Crossword</h1>
          </div>
        </header>

        {!gameStarted && (
          <GameSetupPanel
            difficulty={difficulty}
            isGenerating={isGenerating}
            error={generateError}
            onGenerate={handleGenerateGame}
          />
        )}

        {gameStarted && (
          <div className="mb-4 shrink-0 flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetGame}
              className={`${cartoonButtonClass("white")} flex items-center gap-0.5`}
            >
              <IoIosArrowBack size={18} /> Back
            </button>

            <button
              onClick={handleNewGame}
              disabled={isGenerating}
              className={cartoonButtonClass("blue")}
            >
              {isGenerating ? "Generating..." : "New Game"}
            </button>

            <button
              onClick={handleToggleCheck}
              className={cartoonButtonClass(submitted ? "orange" : "green")}
            >
              {submitted ? "Uncheck" : "Check"}
            </button>

            <button
              onClick={handleToggleAnswer}
              className={cartoonButtonClass(showAnswer ? "orange" : "yellow")}
            >
              {showAnswer ? "Hide" : "Answer"}
            </button>

            {crossword && (
              <button
                onClick={async () => {
                  await copyPuzzleLink({
                    difficulty,
                    crossword,
                    revealedCellKeys: Array.from(revealedCells),
                  });

                  setCopySuccess(true);

                  window.setTimeout(() => {
                    setCopySuccess(false);
                  }, 1600);
                }}
                className={cartoonButtonClass("white")}
              >
                Copy Link
              </button>
            )}
          </div>
        )}

        {gameStarted && crossword && (
          <GameStatusBar
            difficulty={difficulty}
            grid={crossword.grid}
            placedWords={crossword.placedWords}
            answers={answers}
            revealedCells={revealedCells}
          />
        )}

        {gameStarted && crossword && (
          <div className="min-h-0 flex-1 flex flex-col lg:flex-row gap-6 lg:gap-9 items-stretch lg:items-start overflow-hidden">
            <section className="w-full lg:flex-1 h-auto lg:h-full min-h-0 overflow-auto flex justify-start sm:justify-center">
              <CrosswordGrid
                grid={crossword.grid}
                placedWords={crossword.placedWords}
                answers={answers}
                revealedCells={revealedCells}
                submitted={submitted}
                isCompleted={isCompleted || showAnswer}
                selectedCellKey={selectedCellKey}
                onSelectCell={handleSelectCell}
                onAnswerChange={handleAnswerChange}
              />
            </section>

            <CluePanel
              placedWords={crossword.placedWords}
              isCompleted={isCompleted || showAnswer}
              selectedWord={selectedWord}
              onSelectWord={setSelectedWord}
              onCloseWord={() => setSelectedWord(null)}
              onPlayWord={(word) => speakWord(word)}
            />
          </div>
        )}
      </div>

      <VirtualKeyboard
        position={keyboardPosition}
        disabled={!selectedCellKey || isCompleted || showAnswer}
        onKeyPress={handleVirtualKeyPress}
        onBackspace={handleVirtualBackspace}
      />

      <CompletionModal
        open={isCompleted}
        difficulty={difficulty}
        onPlayAgain={handleNewGame}
      />

      {copySuccess && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
          <div className="animate-[popIn_0.2s_ease-out] rounded-3xl border-4 border-black bg-white px-8 py-6 shadow-[8px_8px_0_#000]">
            <p className="text-3xl font-black text-center">Link Copied!</p>
            <p className="mt-2 text-center text-slate-600 font-semibold">
              Share it with friends.
            </p>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="rounded-2xl border-2 border-black bg-white px-8 py-6 shadow-[6px_6px_0_#000]">
            <p className="text-2xl font-bold animate-pulse">
              Generating Crossword...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function createRevealedCells(
  grid: ReturnType<typeof generateSimpleCrossword>["grid"],
  difficulty: Difficulty,
) {
  const revealed = new Set<string>();

  const revealRateMap: Record<Difficulty, number> = {
    easy: 0.6,
    hard: 0.4,
    crazy: 0.2,
  };

  const revealRate = revealRateMap[difficulty];

  for (const row of grid) {
    for (const cell of row) {
      if (cell.isEmpty) continue;

      const key = `${cell.row}-${cell.col}`;

      if (Math.random() < revealRate) {
        revealed.add(key);
      }
    }
  }

  return revealed;
}

function speakWord(word: string, audioUrl?: string) {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}

function cartoonButtonClass(
  color: "white" | "blue" | "green" | "yellow" | "orange",
) {
  const colorClass = {
    white: "bg-white hover:bg-slate-100",
    blue: "bg-blue-300 hover:bg-blue-200",
    green: "bg-green-400 hover:bg-green-300",
    yellow: "bg-yellow-300 hover:bg-yellow-200",
    orange: "bg-orange-300 hover:bg-orange-200",
  }[color];

  return `px-2 py-1 rounded-lg text-black font-bold transition border-2 border-black cursor-pointer shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed ${colorClass}`;
}

function getRandomWords<T>(list: T[], count: number) {
  return [...list].sort(() => Math.random() - 0.5).slice(0, count);
}

type SavedPuzzle = {
  difficulty: Difficulty;
  crossword: ReturnType<typeof generateSimpleCrossword>;
  revealedCellKeys: string[];
};

function encodePuzzle(data: SavedPuzzle) {
  return compressToEncodedURIComponent(JSON.stringify(data));
}

function decodePuzzle(value: string): SavedPuzzle | null {
  try {
    const json = decompressFromEncodedURIComponent(value);

    if (!json) return null;

    return JSON.parse(json) as SavedPuzzle;
  } catch {
    return null;
  }
}

async function copyPuzzleLink(data: SavedPuzzle) {
  const encoded = encodePuzzle(data);
  const url = `${window.location.origin}${window.location.pathname}?puzzle=${encoded}`;

  await navigator.clipboard.writeText(url);
}
