import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { announcementTable, userTable } from "@/db/schema";
import { authOptions } from "@/lib/auth";

const createAnnouncementRequestSchema = z.object({
  content: z.string(),
});

type CreateAnnouncementRequest = z.infer<
  typeof createAnnouncementRequestSchema
>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log(data);

  try {
    createAnnouncementRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { content } = data as CreateAnnouncementRequest;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw Error("No session!");

    const [user] = await db
      .select({
        id: userTable.id,
      })
      .from(userTable)
      .where(eq(userTable.email, session.user.email));

    await db
      .insert(announcementTable)
      .values({
        userId: user.id,
        content,
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
