import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import AuthDialog from "@/components/AuthDialog";
import FileTable from "@/components/FileTable";
import { db } from "@/db";
import { courseTable, fileTable, userRoleTable, userTable } from "@/db/schema";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const [user] = await db
      .insert(userTable)
      .values({
        name: session.user.name as string,
        email: session.user.email as string,
      })

      .onConflictDoUpdate({
        target: userTable.email,
        set: {
          name: session.user.name as string,
        },
      })
      .returning()
      .execute();

    await db
      .insert(userRoleTable)
      .values({
        role: "Normal",
        userId: user.id,
      })
      .onConflictDoNothing()
      .execute();
  }

  const fileData = await db
    .select({
      id: fileTable.id,
      contentType: fileTable.contentType,
      examType: fileTable.examType,
      downloadURL: fileTable.downloadURL,
      courseName: courseTable.name,
      courseNumber: courseTable.number,
    })
    .from(fileTable)
    .innerJoin(courseTable, eq(fileTable.courseId, courseTable.id))
    .execute();

  if (!fileData) {
    redirect(`/`);
  }

  return (
    <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
      <FileTable></FileTable>
      <AuthDialog />
    </div>
  );
}
