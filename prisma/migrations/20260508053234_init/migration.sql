-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "clue" TEXT,
    "definition" TEXT,
    "example" TEXT,
    "phonetic" TEXT,
    "audioUrl" TEXT,
    "partOfSpeech" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrosswordClue" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "clue" TEXT NOT NULL,
    "source" TEXT,
    "year" INTEGER,

    CONSTRAINT "CrosswordClue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_word_key" ON "Word"("word");

-- CreateIndex
CREATE INDEX "CrosswordClue_answer_idx" ON "CrosswordClue"("answer");
