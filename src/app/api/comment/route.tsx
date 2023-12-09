import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { commentTable, userTable } from "@/db/schema";

const createCommentRequestSchema = z.object({
  content: z.string(),
  fileId: z.number(),
});

type CreateCommentRequest = z.infer<typeof createCommentRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log(data);

  try {
    createCommentRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { content, fileId } = data as CreateCommentRequest;

  try {
    const session = await getServerSession();
    if (!session?.user.email) throw Error("No session!");

    const [user] = await db
      .select({
        id: userTable.id,
      })
      .from(userTable)
      .where(eq(userTable.email, session.user.email!));

    await db
      .insert(commentTable)
      .values({
        userId: user.id,
        content,
        fileId,
      })
      .onConflictDoNothing()
      .execute();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
