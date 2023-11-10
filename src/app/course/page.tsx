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
import { COURSE, INSTRUCTOR } from "@/db/schema";
import { eq } from "drizzle-orm";

// type CoursePageProps = {};

export default async function CoursePage() {

    const courseData = await db
        .select({
            id: COURSE.id,
            year: COURSE.year,
            semester: COURSE.semester,
            name: COURSE.name,
            instructor_id: COURSE.instructor_id,
            instructor_name: INSTRUCTOR.name,
        })
        .from(COURSE)
        .innerJoin(INSTRUCTOR, eq(COURSE.instructor_id, INSTRUCTOR.id))
        .execute();

    if (!courseData) {
        redirect(`/`);
    }

    return (
        <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
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
                                <TableCell>{`${course.year} - ${course.semester}`}</TableCell>
                                <TableCell>{`${course.instructor_name}`}</TableCell>
                            </TableRow>
                        ))
                    }

                </TableBody>
            </Table>
        </div>
    );
}
