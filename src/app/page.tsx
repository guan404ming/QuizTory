import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { desc, eq } from "drizzle-orm";
import { User } from "lucide-react";

import AuthDialog from "@/components/AuthDialog";
import TimeText from "@/components/Timetext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import {
  announcementTable,
  courseTable,
  fileTable,
  userRoleTable,
  userTable,
} from "@/db/schema";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const [user] = await db
      .insert(userTable)
      .values({
        name: session.user.name as string,
        email: session.user.email as string,
      })

      .onConflictDoUpdate({
        target: userTable.email,
        set: {
          name: session.user.name as string,
        },
      })
      .returning()
      .execute();

    await db
      .insert(userRoleTable)
      .values({
        role: "Normal",
        userId: user.id,
      })
      .onConflictDoNothing()
      .execute();
  }

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

  const announcementData = await db
    .select({
      id: announcementTable.id,
      content: announcementTable.content,
      createdAt: announcementTable.createdAt,
      username: userTable.name,
    })
    .from(announcementTable)
    .innerJoin(userTable, eq(announcementTable.userId, userTable.id))
    .orderBy(desc(announcementTable.createdAt))
    .limit(3)
    .execute();

  if (!fileData) {
    redirect(`/`);
  }

  return (
    <>
      <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
        <h1 className="bg-white px-4 py-4 text-xl font-bold">Announcement</h1>
        <div className="px-4">
          {announcementData.map((announcement) => (
            <Alert
              key={announcement.id}
              className="mb-3 align-middle drop-shadow-sm"
            >
              <User className="ml-1 h-5 w-5" />
              <AlertTitle className="ml-2">{announcement.content}</AlertTitle>
              <AlertDescription className="ml-2 text-gray-500">
                @ {announcement.username}
                <TimeText
                  date={announcement.createdAt}
                  format=" · MM/DD h:mm A"
                />
              </AlertDescription>
            </Alert>
          ))}
        </div>

        <h1 className="bg-white px-4 py-4 text-xl font-bold">Files</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Number</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Exam Type</TableHead>
              <TableHead>Content Type</TableHead>
              <TableHead>File</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fileData.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  {file.courseNumber}
                </TableCell>
                <TableCell className="font-medium">{file.courseName}</TableCell>
                <TableCell>{file.examType}</TableCell>
                <TableCell>{file.contentType}</TableCell>
                <TableCell className="text-blue-500 underline">
                  <Link target="_blank" href={file.downloadURL as string}>
                    Link
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AuthDialog />
    </>
  );
}
