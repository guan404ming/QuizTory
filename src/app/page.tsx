import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import AuthDialog from "@/components/AuthDialog";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/db";
import { courseTable, fileTable, userRoleTable, userTable } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import { fileColumns } from "@/lib/columns";

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
    .where(eq(fileTable.status, "Public"))
    .execute();

  if (!fileData) {
    redirect(`/`);
  }

  return (
    <div className="flex h-screen w-full max-w-2xl flex-col overflow-hidden pt-2">
      <h1 className="bg-white px-5 py-2 text-xl font-bold">🏠 &nbsp;Home</h1>
      <DataTable
        link
        columns={fileColumns}
        data={fileData}
        placeholder="Filter file  -=≡Σ((( つ•̀ω•́ )つ"
      />
      <AuthDialog />
    </div>
  );
}
