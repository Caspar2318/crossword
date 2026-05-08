import { VocabWord } from "@/types/word";

export type CrosswordCell = {
  letter: string;
  row: number;
  col: number;
  isEmpty: boolean;
};

export type PlacedWord = {
  word: string;
  definition?: string;
  clue: string;
  phonetic?: string;
  audioUrl?: string;
  row: number;
  col: number;
  direction: "across" | "down";
  partOfSpeech?: string;
};

function getGridSize(words: VocabWord[]) {
  const longestWordLength = Math.max(
    ...words.map((item) => normalizeWord(item.word).length),
  );

  return Math.max(MIN_gridSize, longestWordLength + EXTRA_PADDING);
}
const MIN_gridSize = 18;
const EXTRA_PADDING = 8;
const ATTEMPTS = 300;

type Direction = "across" | "down";

type GenerateResult = {
  grid: CrosswordCell[][];
  placedWords: PlacedWord[];
};

type Candidate = {
  row: number;
  col: number;
  direction: Direction;
  score: number;
};

export function generateSimpleCrossword(words: VocabWord[]): GenerateResult {
  const gridSize = getGridSize(words);

  let bestResult: GenerateResult | null = null;

  for (let i = 0; i < ATTEMPTS; i++) {
    const result = generateOneCrossword(words, i, gridSize);

    if (!bestResult || isBetterResult(result, bestResult, gridSize)) {
      bestResult = result;
    }
  }

  if (!bestResult) {
    return createEmptyCrossword(gridSize);
  }

  return trimCrossword(bestResult, gridSize);
}

function generateOneCrossword(
  words: VocabWord[],
  attemptIndex: number,
  gridSize: number,
): GenerateResult {
  const grid = createEmptyGrid(gridSize);
  const placedWords: PlacedWord[] = [];

  const sortedWords = prepareWords(words, attemptIndex);

  if (sortedWords.length === 0) {
    return { grid, placedWords };
  }

  const first = sortedWords[0];
  const firstWord = normalizeWord(first.word);

  const firstDirection: Direction = attemptIndex % 2 === 0 ? "across" : "down";

  const startRow =
    firstDirection === "across"
      ? Math.floor(gridSize / 2)
      : Math.floor((gridSize - firstWord.length) / 2);

  const startCol =
    firstDirection === "across"
      ? Math.floor((gridSize - firstWord.length) / 2)
      : Math.floor(gridSize / 2);

  placeWord(grid, firstWord, startRow, startCol, firstDirection);
  placedWords.push(createPlacedWord(first, startRow, startCol, firstDirection));

  for (let i = 1; i < sortedWords.length; i++) {
    const current = sortedWords[i];
    const currentWord = normalizeWord(current.word);

    const bestCandidate = findBestPlacement(grid, currentWord, gridSize);

    if (!bestCandidate) continue;

    placeWord(
      grid,
      currentWord,
      bestCandidate.row,
      bestCandidate.col,
      bestCandidate.direction,
    );

    placedWords.push(
      createPlacedWord(
        current,
        bestCandidate.row,
        bestCandidate.col,
        bestCandidate.direction,
      ),
    );
  }

  return {
    grid,
    placedWords,
  };
}

function isBetterResult(
  next: GenerateResult,
  best: GenerateResult,
  gridSize: number,
): boolean {
  const nextBox = getBoundingBox(next.grid, gridSize);
  const bestBox = getBoundingBox(best.grid, gridSize);

  if (next.placedWords.length !== best.placedWords.length) {
    return next.placedWords.length > best.placedWords.length;
  }

  const nextArea = nextBox.width * nextBox.height;
  const bestArea = bestBox.width * bestBox.height;

  if (nextArea !== bestArea) {
    return nextArea < bestArea;
  }

  const nextFilled = countFilledCells(next.grid);
  const bestFilled = countFilledCells(best.grid);

  return nextFilled > bestFilled;
}

function createEmptyCrossword(gridSize: number): GenerateResult {
  return {
    grid: createEmptyGrid(gridSize),
    placedWords: [],
  };
}

function createEmptyGrid(gridSize: number): CrosswordCell[][] {
  return Array.from({ length: gridSize }, (_, row) =>
    Array.from({ length: gridSize }, (_, col) => ({
      letter: "",
      row,
      col,
      isEmpty: true,
    })),
  );
}

function prepareWords(words: VocabWord[], attemptIndex: number): VocabWord[] {
  const validWords = words.filter((item) => {
    const normalized = normalizeWord(item.word);
    return normalized.length >= 3 && normalized.length <= 10;
  });

  if (attemptIndex % 4 === 0) {
    return [...validWords].sort(
      (a, b) => normalizeWord(b.word).length - normalizeWord(a.word).length,
    );
  }

  if (attemptIndex % 4 === 1) {
    return [...validWords].sort(
      (a, b) => normalizeWord(a.word).length - normalizeWord(b.word).length,
    );
  }

  if (attemptIndex % 4 === 2) {
    return [...validWords].sort(
      (a, b) => scoreWordForCrossword(b) - scoreWordForCrossword(a),
    );
  }

  return shuffleWords(validWords);
}

function scoreWordForCrossword(vocab: VocabWord): number {
  const word = normalizeWord(vocab.word);
  const commonLetters = new Set(["E", "A", "R", "I", "O", "T", "N", "S", "L"]);

  let score = 0;

  for (const letter of word) {
    if (commonLetters.has(letter)) {
      score += 3;
    }
  }

  if (word.length >= 4 && word.length <= 7) {
    score += 10;
  }

  if (word.length >= 9) {
    score -= 8;
  }

  return score;
}

function shuffleWords(words: VocabWord[]): VocabWord[] {
  const result = [...words];

  for (let i = result.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }

  return result;
}

function normalizeWord(word: string): string {
  return word.toUpperCase().replace(/[^A-Z]/g, "");
}

function findBestPlacement(
  grid: CrosswordCell[][],
  word: string,
  gridSize: number,
): Candidate | null {
  const candidates: Candidate[] = [];

  for (let wordIndex = 0; wordIndex < word.length; wordIndex++) {
    const letter = word[wordIndex];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (grid[row][col].letter !== letter) continue;

        const acrossRow = row;
        const acrossCol = col - wordIndex;

        if (
          canPlaceWord(grid, word, acrossRow, acrossCol, "across", gridSize)
        ) {
          candidates.push({
            row: acrossRow,
            col: acrossCol,
            direction: "across",
            score: scorePlacement(
              grid,
              word,
              acrossRow,
              acrossCol,
              "across",
              gridSize,
            ),
          });
        }

        const downRow = row - wordIndex;
        const downCol = col;

        if (canPlaceWord(grid, word, downRow, downCol, "down", gridSize)) {
          candidates.push({
            row: downRow,
            col: downCol,
            direction: "down",
            score: scorePlacement(
              grid,
              word,
              downRow,
              downCol,
              "down",
              gridSize,
            ),
          });
        }
      }
    }
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.score - a.score);

  return candidates[0];
}

function canPlaceWord(
  grid: CrosswordCell[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: Direction,
  gridSize: number,
): boolean {
  if (startRow < 0 || startCol < 0) return false;

  const endRow = direction === "down" ? startRow + word.length - 1 : startRow;
  const endCol = direction === "across" ? startCol + word.length - 1 : startCol;

  if (endRow >= gridSize || endCol >= gridSize) return false;

  let intersections = 0;

  for (let i = 0; i < word.length; i++) {
    const row = direction === "down" ? startRow + i : startRow;
    const col = direction === "across" ? startCol + i : startCol;

    const cell = grid[row][col];

    if (!cell.isEmpty && cell.letter !== word[i]) {
      return false;
    }

    if (!cell.isEmpty && cell.letter === word[i]) {
      intersections++;
    }

    if (cell.isEmpty) {
      if (direction === "across") {
        if (row > 0 && !grid[row - 1][col].isEmpty) return false;
        if (row < gridSize - 1 && !grid[row + 1][col].isEmpty) return false;
      }

      if (direction === "down") {
        if (col > 0 && !grid[row][col - 1].isEmpty) return false;
        if (col < gridSize - 1 && !grid[row][col + 1].isEmpty) return false;
      }
    }
  }

  if (intersections === 0) return false;

  if (direction === "across") {
    if (startCol > 0 && !grid[startRow][startCol - 1].isEmpty) return false;

    if (endCol < gridSize - 1 && !grid[startRow][endCol + 1].isEmpty) {
      return false;
    }
  }

  if (direction === "down") {
    if (startRow > 0 && !grid[startRow - 1][startCol].isEmpty) return false;

    if (endRow < gridSize - 1 && !grid[endRow + 1][startCol].isEmpty) {
      return false;
    }
  }

  return true;
}

function scorePlacement(
  grid: CrosswordCell[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: Direction,
  gridSize: number,
): number {
  let intersections = 0;
  let newLetters = 0;

  for (let i = 0; i < word.length; i++) {
    const row = direction === "down" ? startRow + i : startRow;
    const col = direction === "across" ? startCol + i : startCol;

    if (!grid[row][col].isEmpty && grid[row][col].letter === word[i]) {
      intersections++;
    } else {
      newLetters++;
    }
  }

  const nextGrid = cloneGrid(grid);
  placeWord(nextGrid, word, startRow, startCol, direction);

  const box = getBoundingBox(nextGrid, gridSize);
  const area = box.width * box.height;

  const center = Math.floor(gridSize / 2);
  const wordCenterRow =
    direction === "down" ? startRow + Math.floor(word.length / 2) : startRow;
  const wordCenterCol =
    direction === "across" ? startCol + Math.floor(word.length / 2) : startCol;

  const distanceFromCenter =
    Math.abs(wordCenterRow - center) + Math.abs(wordCenterCol - center);

  return (
    intersections * 500 - area * 8 - newLetters * 2 - distanceFromCenter * 4
  );
}

function placeWord(
  grid: CrosswordCell[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: Direction,
): void {
  for (let i = 0; i < word.length; i++) {
    const row = direction === "down" ? startRow + i : startRow;
    const col = direction === "across" ? startCol + i : startCol;

    grid[row][col] = {
      letter: word[i],
      row,
      col,
      isEmpty: false,
    };
  }
}

function trimCrossword(
  result: GenerateResult,
  gridSize: number,
): GenerateResult {
  const box = getBoundingBox(result.grid, gridSize);

  if (box.isEmpty) {
    return result;
  }

  const trimmedGrid: CrosswordCell[][] = [];

  for (let row = box.minRow; row <= box.maxRow; row++) {
    const newRow: CrosswordCell[] = [];

    for (let col = box.minCol; col <= box.maxCol; col++) {
      const oldCell = result.grid[row][col];

      newRow.push({
        ...oldCell,
        row: row - box.minRow,
        col: col - box.minCol,
      });
    }

    trimmedGrid.push(newRow);
  }

  const trimmedPlacedWords = result.placedWords.map((word) => ({
    ...word,
    row: word.row - box.minRow,
    col: word.col - box.minCol,
  }));

  return {
    grid: trimmedGrid,
    placedWords: trimmedPlacedWords,
  };
}

function getBoundingBox(grid: CrosswordCell[][], gridSize: number) {
  let minRow = gridSize;
  let maxRow = -1;
  let minCol = gridSize;
  let maxCol = -1;

  for (const row of grid) {
    for (const cell of row) {
      if (cell.isEmpty) continue;

      minRow = Math.min(minRow, cell.row);
      maxRow = Math.max(maxRow, cell.row);
      minCol = Math.min(minCol, cell.col);
      maxCol = Math.max(maxCol, cell.col);
    }
  }

  const isEmpty = maxRow === -1;

  return {
    minRow,
    maxRow,
    minCol,
    maxCol,
    width: isEmpty ? 0 : maxCol - minCol + 1,
    height: isEmpty ? 0 : maxRow - minRow + 1,
    isEmpty,
  };
}

function countFilledCells(grid: CrosswordCell[][]): number {
  let count = 0;

  for (const row of grid) {
    for (const cell of row) {
      if (!cell.isEmpty) {
        count++;
      }
    }
  }

  return count;
}

function cloneGrid(grid: CrosswordCell[][]): CrosswordCell[][] {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

function createPlacedWord(
  vocab: VocabWord,
  row: number,
  col: number,
  direction: Direction,
): PlacedWord {
  return {
    word: vocab.word,
    definition: vocab.definition,
    clue: vocab.clue || vocab.definition || vocab.word,
    phonetic: vocab.phonetic,
    audioUrl: vocab.audioUrl,
    row,
    col,
    direction,
    partOfSpeech: vocab.partOfSpeech,
  };
}
