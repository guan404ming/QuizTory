import { redirect } from "next/navigation";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { db } from "@/db";
import { courseTable, instructorTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// type CoursePageProps = {};

export default async function CoursePage() {

    const courseData = await db
        .select({
            id: courseTable.id,
            semester: courseTable.semester,
            name: courseTable.name,
            instructor_id: courseTable.instructorId,
            instructor_name: instructorTable.name,
        })
        .from(courseTable)
        .innerJoin(instructorTable, eq(courseTable.instructorId, instructorTable.id))
        .execute();

    if (!courseData) {
        redirect(`/`);
    }

    return (
        <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
            <h1 className="py-4 bg-white px-4 text-xl font-bold">Course</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>課名</TableHead>
                        <TableHead>開課學期</TableHead>
                        <TableHead>授課教師</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        courseData.map((course) => (
                            <TableRow key={course.id}>
                                <TableCell className="font-medium">{course.name}</TableCell>
                                <TableCell>{`${course.semester}`}</TableCell>
                                <TableCell>{`${course.instructor_name}`}</TableCell>
                            </TableRow>
                        ))
                    }

                </TableBody>
            </Table>
        </div>
    );
}
