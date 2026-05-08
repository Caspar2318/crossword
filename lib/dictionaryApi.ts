import { VocabWord } from "@/types/word";

type FreeDictionaryResponse = {
  word?: string;
  entries?: {
    partOfSpeech?: string;
    pronunciations?: {
      text?: string;
      audio?: string;
    }[];
    senses?: {
      definition?: string;
      examples?: string[];
    }[];
  }[];
};

function normalizeWord(word: string) {
  return word.toLowerCase().replace(/[^a-z]/g, "");
}

function cleanText(value?: string) {
  const cleaned = value?.trim();
  return cleaned || undefined;
}

export async function fetchWordInfo(word: string): Promise<VocabWord> {
  const clean = normalizeWord(word);

  try {
    const res = await fetch(
      `https://freedictionaryapi.com/api/v1/entries/en/${encodeURIComponent(clean)}`,
    );

    if (!res.ok) {
      return {
        word: clean,
        definition: clean,
        clue: clean,
      };
    }

    const data = (await res.json()) as FreeDictionaryResponse;

    const entries = data.entries ?? [];
    const firstEntryWithDefinition = entries.find((entry) =>
      entry.senses?.some((sense) => cleanText(sense.definition)),
    );

    const firstSense = firstEntryWithDefinition?.senses?.find((sense) =>
      cleanText(sense.definition),
    );

    const firstEntryWithPronunciation = entries.find((entry) =>
      entry.pronunciations?.some((item) => item.text || item.audio),
    );

    const definition = cleanText(firstSense?.definition) || clean;
    const example = cleanText(firstSense?.examples?.[0]);

    const phonetic = cleanText(
      firstEntryWithPronunciation?.pronunciations?.find((item) => item.text)
        ?.text,
    );

    const audioUrl = cleanText(
      firstEntryWithPronunciation?.pronunciations?.find((item) => item.audio)
        ?.audio,
    );

    return {
      word: normalizeWord(data.word || clean),
      definition,
      clue: definition,
      example,
      phonetic,
      audioUrl,
      partOfSpeech: firstEntryWithDefinition?.partOfSpeech,
    };
  } catch {
    return {
      word: clean,
      definition: clean,
      clue: clean,
    };
  }
}

export async function fetchWordsInfo(words: string[]): Promise<VocabWord[]> {
  return Promise.all(words.map((word) => fetchWordInfo(word)));
}
