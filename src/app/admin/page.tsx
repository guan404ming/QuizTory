import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { Overview } from "@/components/Overview";
import AnnouncementBlock from "@/components/admin/AnnouncementBlock";
import CourseBlock from "@/components/admin/CourseBlock";
import FileBlock from "@/components/admin/FileBlock";
import RoleBlock from "@/components/admin/RoleBlock";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import {
  activityRecordTable,
  courseTable,
  fileTable,
  userRoleTable,
  userTable,
} from "@/db/schema";
import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const fileData = await db
    .select({
      id: fileTable.id,
      userId: fileTable.userId,
      contentType: fileTable.contentType,
      examType: fileTable.examType,
      status: fileTable.status,
      downloadURL: fileTable.downloadURL,
      courseNumber: courseTable.number,
    })
    .from(fileTable)
    .innerJoin(courseTable, eq(fileTable.courseId, courseTable.id));
  const userData = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      role: userRoleTable.role,
    })
    .from(userTable)
    .innerJoin(userRoleTable, eq(userRoleTable.userId, userTable.id));

  if (session?.user.role !== "Admin") {
    redirect("/");
  }
  const activityList = await db.select().from(activityRecordTable);

  return (
    <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
      <h1 className="bg-white px-5 py-2 text-xl font-bold">🧑🏼‍💻 &nbsp;Admin</h1>
      <Card className="mx-5 mt-2">
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent className="-ml-4 pl-2">
          <Overview messageList={activityList} />
        </CardContent>
      </Card>
      <div className="mx-5 mt-5 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <AnnouncementBlock />
        <CourseBlock />
        <FileBlock fileData={fileData} />
        <RoleBlock userData={userData} />
      </div>
    </div>
  );
}
