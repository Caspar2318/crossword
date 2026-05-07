export type VocabWord = {
  word: string;
  meaning: string;
  clue: string;
  phonetic?: string;
  audioUrl?: string;
  partOfSpeech?: string;
  level: "CET4" | "CET6";
};
