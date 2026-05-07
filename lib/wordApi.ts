import { VocabWord } from "@/types/word";

type DictionaryApiResponse = {
  word: string;
  phonetics?: {
    text?: string;
    audio?: string;
  }[];
  meanings?: {
    partOfSpeech?: string;
    definitions?: {
      definition?: string;
      example?: string;
    }[];
  }[];
}[];

type DatamuseWord = {
  word: string;
};

const CACHE_KEY = "crossword_word_cache_v1";

export const themes = [
  "school",
  "study",
  "travel",
  "nature",
  "money",
  "health",
  "family",
  "future",
  "science",
  "culture",
  "music",
  "history",
  "food",
  "city",
];

export async function fetchGameWords(
  count: number,
  theme?: string,
): Promise<VocabWord[]> {
  const seed = theme ?? themes[Math.floor(Math.random() * themes.length)];

  const datamuseRes = await fetch(
    `https://api.datamuse.com/words?ml=${seed}&sp=??????*&max=${count * 5}`,
  );

  if (!datamuseRes.ok) {
    throw new Error("Failed to fetch word list.");
  }

  const datamuseWords = (await datamuseRes.json()) as DatamuseWord[];

  const candidates = datamuseWords
    .map((item) => item.word.toLowerCase())
    .filter((word) => /^[a-z]+$/.test(word))
    .filter((word) => word.length >= 5 && word.length <= 9);

  const uniqueCandidates = [...new Set(candidates)];

  const results: VocabWord[] = [];

  for (const word of uniqueCandidates) {
    if (results.length >= count) break;

    const detail = await getWordDetailWithCache(word);

    if (detail) {
      results.push(detail);
    }
  }

  return results;
}

async function getWordDetailWithCache(word: string): Promise<VocabWord | null> {
  const cached = getCachedWord(word);

  if (cached) {
    return cached;
  }

  const detail = await fetchDictionaryDetail(word);

  if (detail) {
    saveWordToCache(detail);
  }

  return detail;
}

async function fetchDictionaryDetail(word: string): Promise<VocabWord | null> {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );

    if (!res.ok) return null;

    const data = (await res.json()) as DictionaryApiResponse;
    const entry = data[0];

    const firstMeaning = entry.meanings?.[0];
    const firstDefinition = firstMeaning?.definitions?.[0];

    const phonetic = entry.phonetics?.find((item) => item.text)?.text;
    const audioUrl = entry.phonetics?.find((item) => item.audio)?.audio;
    const clue = firstDefinition?.definition;

    if (!entry.word || !clue) return null;

    return {
      word: entry.word.toLowerCase(),
      meaning: clue,
      clue,
      phonetic,
      audioUrl,
      partOfSpeech: firstMeaning?.partOfSpeech,
      level: "CET4",
    };
  } catch {
    return null;
  }
}

function getCachedWord(word: string): VocabWord | null {
  if (typeof window === "undefined") return null;

  try {
    const cache = getCache();
    return cache[word] ?? null;
  } catch {
    return null;
  }
}

function saveWordToCache(wordData: VocabWord) {
  if (typeof window === "undefined") return;

  try {
    const cache = getCache();

    cache[wordData.word.toLowerCase()] = wordData;

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage may be full or unavailable. Ignore safely.
  }
}

function getCache(): Record<string, VocabWord> {
  const raw = localStorage.getItem(CACHE_KEY);

  if (!raw) return {};

  return JSON.parse(raw) as Record<string, VocabWord>;
}
