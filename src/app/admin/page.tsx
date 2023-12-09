import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import AnnouncementBlock from "@/components/admin/AnnouncementBlock";
import CourseBlock from "@/components/admin/CourseBlock";
import FileBlock from "@/components/admin/FileBlock";
import RoleBlock from "@/components/admin/RoleBlock";
import { db } from "@/db";
import { fileTable, userTable } from "@/db/schema";
import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const fileData = await db.select().from(fileTable);
  const userData = await db.select().from(userTable);

  if (session?.user.role !== "Admin") {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
      <h1 className="bg-white px-4 py-4 text-xl font-bold">Admin</h1>
      <div className="grid grid-cols-2 gap-4 px-4">
        <AnnouncementBlock />
        <CourseBlock />
        <FileBlock fileData={fileData} />
        <RoleBlock userData={userData} />
      </div>
    </div>
  );
}
