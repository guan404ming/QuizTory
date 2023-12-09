import { eq } from "drizzle-orm";

import { db } from "@/db";
import { courseTable, fileTable } from "@/db/schema";
import { fileColumns } from "@/lib/columns";

import { DataTable } from "./ui/data-table";

export default async function FileTable() {
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

  return (
    <>
      <h1 className="bg-white px-5 py-2 text-xl font-bold">Files</h1>
      <DataTable columns={fileColumns} data={fileData} />
    </>
  );
}
