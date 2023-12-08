import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { courseTable, instructorTable } from "@/db/schema";
import { authOptions } from "@/lib/auth";

const uploadCourseRequestSchema = z
  .object({
    number: z.string(),
    name: z.string(),
    instructorName: z.string(),
    semester: z.string(),
    departmentName: z.string(),
  })
  .array();

type UploadCourseRequest = z.infer<typeof uploadCourseRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    uploadCourseRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const courses = data as UploadCourseRequest;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw Error("No session!");

    await db.transaction(async (tx) => {
      // insert instructors
      await tx
        .insert(instructorTable)
        .values(
          courses.map((course) => ({
            name: course.instructorName,
            departmentName: course.departmentName,
          })),
        )
        .onConflictDoNothing()
        .execute();

      // insert courses
      const instructors = await tx
        .select({ id: instructorTable.id, name: instructorTable.name })
        .from(instructorTable);
      const instructorMap = new Map(instructors.map((i) => [i.name, i.id]));

      await tx
        .insert(courseTable)
        .values(
          courses.map((course) => ({
            ...course,
            instructorId: instructorMap.get(course.instructorName)!,
          })),
        )
        .onConflictDoNothing()
        .execute();
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
