import { redirect } from "next/navigation";

import type { ColumnDef } from "@tanstack/react-table";
import { eq } from "drizzle-orm";

import { DataTable } from "@/components/ui/data-table";
import { db } from "@/db";
import { courseTable, instructorTable } from "@/db/schema";

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

  const columns: ColumnDef<{
    id: number;
    semester: string;
    name: string;
    instructor_id: number;
    instructor_name: string;
  }>[] = [
    {
      accessorKey: "number",
      header: "Number",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "semester",
      header: "Semester",
    },
    {
      accessorKey: "instructor_name",
      header: "Instructor",
    },
  ];

  return (
    <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
      <h1 className="bg-white px-4 py-4 text-xl font-bold">Course</h1>
      <DataTable columns={columns} data={courseData} />
    </div>
  );
}
