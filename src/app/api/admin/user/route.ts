import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { roleChangedRecordTable, userRoleTable, userTable } from "@/db/schema";
import { authOptions } from "@/lib/auth";

const changeUserRoleRequestSchema = z.object({
  changeeId: z.number(),
  role: z.enum(["Admin", "Blocked", "Normal"]),
});

type ChangeUserRoleRequest = z.infer<typeof changeUserRoleRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log(data);

  try {
    changeUserRoleRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { changeeId, role } = data as ChangeUserRoleRequest;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw Error("No session!");

    const [changer] = await db
      .select({
        id: userTable.id,
      })
      .from(userTable)
      .where(eq(userTable.email, session.user.email));

    const [changee] = await db
      .select({
        id: userRoleTable.userId,
        role: userRoleTable.role,
      })
      .from(userRoleTable)
      .where(eq(userRoleTable.userId, changeeId));

    await db
      .insert(userRoleTable)
      .values({ userId: changeeId, role })
      .onConflictDoUpdate({
        target: userRoleTable.userId,
        set: { role },
      });

    await db
      .insert(roleChangedRecordTable)
      .values({
        from: changee?.role ?? "Normal",
        to: role,
        changeeId: changeeId,
        changerId: changer.id,
      })
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
