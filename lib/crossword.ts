import { VocabWord } from "@/types/word";

export type CrosswordCell = {
  letter: string;
  row: number;
  col: number;
  isEmpty: boolean;
};

export type PlacedWord = {
  word: string;
  meaning: string;
  clue: string;
  phonetic?: string;
  audioUrl?: string;
  row: number;
  col: number;
  direction: "across" | "down";
  partOfSpeech?: string;
};

const GRID_SIZE = 15;

export function generateSimpleCrossword(words: VocabWord[]) {
  const grid: CrosswordCell[][] = Array.from({ length: GRID_SIZE }, (_, row) =>
    Array.from({ length: GRID_SIZE }, (_, col) => ({
      letter: "",
      row,
      col,
      isEmpty: true,
    })),
  );

  const placedWords: PlacedWord[] = [];
  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);

  const first = sortedWords[0];
  const firstWord = first.word.toUpperCase();

  const startRow = Math.floor(GRID_SIZE / 2);
  const startCol = Math.floor((GRID_SIZE - firstWord.length) / 2);

  for (let i = 0; i < firstWord.length; i++) {
    grid[startRow][startCol + i] = {
      letter: firstWord[i],
      row: startRow,
      col: startCol + i,
      isEmpty: false,
    };
  }

  placedWords.push({
    word: first.word,
    meaning: first.meaning,
    clue: first.clue,
    phonetic: first.phonetic,
    row: startRow,
    col: startCol,
    direction: "across",
    partOfSpeech: first.partOfSpeech,
  });

  for (let w = 1; w < sortedWords.length; w++) {
    const current = sortedWords[w];
    const currentWord = current.word.toUpperCase();
    let placed = false;

    for (let i = 0; i < currentWord.length && !placed; i++) {
      const letter = currentWord[i];

      for (let row = 0; row < GRID_SIZE && !placed; row++) {
        for (let col = 0; col < GRID_SIZE && !placed; col++) {
          if (grid[row][col].letter === letter) {
            const startRowForWord = row - i;

            if (canPlaceDown(grid, currentWord, startRowForWord, col)) {
              placeDown(grid, currentWord, startRowForWord, col);

              placedWords.push({
                word: current.word,
                meaning: current.meaning,
                clue: current.clue,
                phonetic: current.phonetic,
                row: startRowForWord,
                col,
                direction: "down",
                partOfSpeech: current.partOfSpeech,
              });

              placed = true;
            }
          }
        }
      }
    }
  }

  return {
    grid,
    placedWords,
  };
}

function canPlaceDown(
  grid: CrosswordCell[][],
  word: string,
  startRow: number,
  col: number,
) {
  if (startRow < 0) return false;
  if (startRow + word.length > GRID_SIZE) return false;

  for (let i = 0; i < word.length; i++) {
    const cell = grid[startRow + i][col];

    if (!cell.isEmpty && cell.letter !== word[i]) {
      return false;
    }
  }

  return true;
}

function placeDown(
  grid: CrosswordCell[][],
  word: string,
  startRow: number,
  col: number,
) {
  for (let i = 0; i < word.length; i++) {
    grid[startRow + i][col] = {
      letter: word[i],
      row: startRow + i,
      col,
      isEmpty: false,
    };
  }
}
