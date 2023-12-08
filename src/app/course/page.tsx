import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { DataTable } from "@/components/ui/data-table";
import { db } from "@/db";
import { courseTable, instructorTable } from "@/db/schema";
import { courseColumns } from "@/lib/columns";

// type CoursePageProps = {};

export default async function CoursePage() {
  const courseData = await db
    .select({
      id: courseTable.id,
      number: courseTable.number,
      semester: courseTable.semester,
      name: courseTable.name,
      instructor_id: courseTable.instructorId,
      instructor_name: instructorTable.name,
    })
    .from(courseTable)
    .innerJoin(
      instructorTable,
      eq(courseTable.instructorId, instructorTable.id),
    )
    .execute();

  if (!courseData) {
    redirect(`/`);
  }

  return (
    <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
      <h1 className="bg-white px-4 py-4 text-xl font-bold">Course</h1>
      <DataTable columns={courseColumns} data={courseData} />
    </div>
  );
}
