import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/db";
import { courseTable, instructorTable } from "@/db/schema";
import { courseColumns } from "@/lib/columns";

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
    <PageContainer emoji="📖" title="Course">
      <DataTable
        link={false}
        columns={courseColumns}
        data={courseData}
        placeholder="Filter course  -=≡Σ((( つ•̀ω•́ )つ"
      />
    </PageContainer>
  );
}
