import { redirect } from "next/navigation";

import { UploadCard } from "@/components/UploadCard";
import { db } from "@/db";
import { courseTable } from "@/db/schema";

// type CoursePageProps = {};

export default async function CoursePage() {
  const courseData = await db.select().from(courseTable).execute();

  if (!courseData) {
    redirect(`/`);
  }

  return (
    <div className="flex h-screen w-full max-w-2xl flex-col items-center justify-center overflow-scroll">
      <UploadCard courseData={courseData}></UploadCard>
    </div>
  );
}
