import { NextResponse } from "next/server";

import { getAdminServerSession } from "../utils";
import { faker } from "@faker-js/faker";

import { db } from "@/db";
import { userRoleTable, userTable } from "@/db/schema";

export async function GET() {
  try {
    const session = await getAdminServerSession();
    if (!session) throw Error("No Session");

    const userList = [];

    for (let i = 0; i < 500; i++) {
      userList.push({
        email: faker.internet.email(),
        name: faker.person.fullName(),
      });
    }

    const curUserList = await db
      .insert(userTable)
      .values(userList)
      .returning()
      .execute();

    const curUserList_: {
      userId: number;
      role: "Normal";
    }[] = curUserList.map((user) => ({
      userId: user.id,
      role: "Normal",
    }));

    db.insert(userRoleTable).values(curUserList_).returning().execute();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
