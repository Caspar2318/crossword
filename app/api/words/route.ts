import { db } from "@/lib/db";

export async function GET() {
  const words = await db.word.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return Response.json({
    success: true,
    words,
  });
}
