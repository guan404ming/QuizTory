import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import AuthDialog from "@/components/AuthDialog";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/db";
import { courseTable, fileTable } from "@/db/schema";
import { fileColumns } from "@/lib/columns";

export default async function Home() {
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
