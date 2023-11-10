import { UploadCard } from "@/components/UploadCard";
import { db } from "@/db";
import { COURSE } from "@/db/schema";
import { redirect } from "next/navigation";

// type CoursePageProps = {};

export default async function CoursePage() {

    const courseData = await db
        .select({ id: COURSE.id })
        .from(COURSE)
        .execute();

    if (!courseData) {
        redirect(`/`);
    }

    return (
        <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll items-center justify-center">
            <UploadCard courseData={courseData}></UploadCard>
        </div>
    );
}
