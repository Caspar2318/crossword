import { db } from "@/lib/db";
import { fetchWordInfo } from "@/lib/dictionaryApi";

type ImportWordsBody = {
  words: string[];
};

function normalizeWord(word: string) {
  return word.toLowerCase().replace(/[^a-z]/g, "");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ImportWordsBody;

    const uniqueWords = [
      ...new Set(
        body.words.map(normalizeWord).filter((word) => word.length >= 2),
      ),
    ];

    if (uniqueWords.length < 30 || uniqueWords.length > 40) {
      return Response.json(
        {
          success: false,
          error: "Please import 30–40 words.",
        },
        { status: 400 },
      );
    }

    const wordDetails = await Promise.all(
      uniqueWords.map(async (word) => {
        const dictionaryData = await fetchWordInfo(word);

        return {
          ...dictionaryData,
          word,
          clue: dictionaryData.definition || word,
        };
      }),
    );

    await db.word.deleteMany();

    await db.word.createMany({
      data: wordDetails.map((item) => ({
        word: item.word,
        clue: item.clue,
        definition: item.definition,
        example: item.example,
        phonetic: item.phonetic,
        audioUrl: item.audioUrl,
        partOfSpeech: item.partOfSpeech,
      })),
    });

    const savedWords = await db.word.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return Response.json({
      success: true,
      words: savedWords,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: "Failed to import words.",
      },
      { status: 500 },
    );
  }
}
