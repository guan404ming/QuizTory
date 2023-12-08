import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { fileTable, settingTable, userTable } from "@/db/schema";
import { authOptions } from "@/lib/auth";

const changeFileStatusRequestSchema = z.object({
  fileId: z.number(),
  status: z.enum(["Private", "Public"]),
});

type ChangeFileStatusRequest = z.infer<typeof changeFileStatusRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log(data);

  try {
    changeFileStatusRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { fileId, status } = data as ChangeFileStatusRequest;

  try {
    await db.transaction(async (tx) => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) throw Error("No session!");

      const [user] = await tx
        .select({
          id: userTable.id,
        })
        .from(userTable)
        .where(eq(userTable.email, session.user.email));

      await tx
        .update(fileTable)
        .set({ status })
        .where(eq(fileTable.id, fileId));

      await tx
        .insert(settingTable)
        .values({
          userId: user.id,
          type: status === "Private" ? "Set_private" : "Set_public",
        })
        .execute();
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
