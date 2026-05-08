import { generateSimpleCrossword } from "@/lib/crossword";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import confetti from "canvas-confetti";
import { VocabWord } from "@/types/word";

export type SavedPuzzle = {
  crossword: ReturnType<typeof generateSimpleCrossword>;
  revealedCellKeys: string[];
};

export function createRevealedCells(
  grid: ReturnType<typeof generateSimpleCrossword>["grid"],
) {
  const revealed = new Set<string>();
  const revealRate = 0.2;

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

export function speakWord(word: string, audioUrl?: string) {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}

export function cartoonButtonClass(
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

export function getRandomWords<T>(list: T[], count: number) {
  return [...list].sort(() => Math.random() - 0.5).slice(0, count);
}

export function parseWordInput(input: string) {
  return [
    ...new Set(
      input
        .toLowerCase()
        .split(/[\s,，;；、]+/)
        .map((w) => w.trim())
        .filter(Boolean),
    ),
  ];
}

export function encodePuzzle(data: SavedPuzzle) {
  return compressToEncodedURIComponent(JSON.stringify(data));
}

export function decodePuzzle(value: string): SavedPuzzle | null {
  try {
    const json = decompressFromEncodedURIComponent(value);

    if (!json) return null;

    return JSON.parse(json) as SavedPuzzle;
  } catch {
    return null;
  }
}

export async function copyPuzzleLink(data: SavedPuzzle) {
  const encoded = encodePuzzle(data);
  const url = `${window.location.origin}${window.location.pathname}?puzzle=${encoded}`;

  await navigator.clipboard.writeText(url);
}

export function launchWinConfetti() {
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

export function generatePuzzleFromWordBank(words: VocabWord[]) {
  let bestCrossword: ReturnType<typeof generateSimpleCrossword> | null = null;

  for (let i = 0; i < 20; i++) {
    const candidateCount = Math.min(
      words.length,
      Math.floor(Math.random() * 7) + 24,
    );

    const candidates = getRandomWords(words, candidateCount);
    const crossword = generateSimpleCrossword(candidates);

    if (
      !bestCrossword ||
      crossword.placedWords.length > bestCrossword.placedWords.length
    ) {
      bestCrossword = crossword;
    }

    if (crossword.placedWords.length >= 16) {
      return crossword;
    }
  }

  if (!bestCrossword || bestCrossword.placedWords.length < 12) {
    throw new Error(
      "Could not generate a good crossword. Try using words with more shared letters.",
    );
  }

  return bestCrossword;
}
