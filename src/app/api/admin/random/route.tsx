import { NextResponse } from "next/server";

import { getAdminServerSession } from "../utils";
import { faker } from "@faker-js/faker";

import { db } from "@/db";
import { userRoleTable, userTable } from "@/db/schema";

export async function GET() {
  try {
    const session = await getAdminServerSession();
    if (!session) throw Error("No Session");

    for (let i = 0; i < 10; i++) {
      const [user] = await db
        .insert(userTable)
        .values({
          email: faker.internet.email(),
          name: faker.person.fullName(),
        })
        .returning()
        .execute();

      db.insert(userRoleTable)
        .values({
          userId: user.id,
          role: "Normal",
        })
        .returning()
        .execute();
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
