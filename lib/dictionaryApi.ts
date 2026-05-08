import { VocabWord } from "@/types/word";

type DictionaryApiResponse = {
  word: string;
  phonetic?: string;
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
};

function shortenDefinition(definition?: string) {
  if (!definition) return undefined;

  return definition
    .split(";")[0]
    .split(".")[0]
    .replace(/\(.*?\)/g, "")
    .trim();
}

export async function fetchWordInfo(word: string): Promise<VocabWord> {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word,
      )}`,
    );

    if (!res.ok) {
      return {
        word,
      };
    }

    const data = (await res.json()) as DictionaryApiResponse[];

    const first = data[0];
    const firstMeaning = first?.meanings?.[0];
    const firstDefinition = firstMeaning?.definitions?.[0];

    const audioUrl =
      first?.phonetics?.find((item) => item.audio)?.audio || undefined;

    const phonetic =
      first?.phonetic ||
      first?.phonetics?.find((item) => item.text)?.text ||
      undefined;

    const definition = shortenDefinition(firstDefinition?.definition);

    return {
      word: first?.word?.toLowerCase() || word.toLowerCase(),
      definition,
      example: firstDefinition?.example,
      phonetic,
      audioUrl,
      partOfSpeech: firstMeaning?.partOfSpeech,
    };
  } catch {
    return {
      word: word.toLowerCase(),
    };
  }
}

export async function fetchWordsInfo(words: string[]): Promise<VocabWord[]> {
  return Promise.all(words.map((word) => fetchWordInfo(word)));
}
