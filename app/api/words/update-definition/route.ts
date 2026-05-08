import { db } from "@/lib/db";

type UpdateDefinitionBody = {
  id: string;
  definition: string;
};

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as UpdateDefinitionBody;

    const definition = body.definition.trim();

    if (!body.id || !definition) {
      return Response.json(
        { success: false, error: "Definition cannot be empty." },
        { status: 400 },
      );
    }

    const updatedWord = await db.word.update({
      where: {
        id: body.id,
      },
      data: {
        definition,
        clue: definition,
      },
    });

    return Response.json({
      success: true,
      word: updatedWord,
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to update definition." },
      { status: 500 },
    );
  }
}
