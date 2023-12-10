import { eq, desc } from "drizzle-orm";
import { User } from "lucide-react";

import TimeText from "@/components/Timetext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { db } from "@/db";
import { announcementTable, userTable } from "@/db/schema";

export default async function AnnouncementList() {
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
    .limit(5)
    .execute();

  return (
    <div className="mt-3 max-md:hidden">
      <h1 className="flex items-center space-x-2 bg-white px-4 py-4 pt-5 text-lg font-semibold">
        <p>🔔 &nbsp;Announcement</p>
      </h1>
      <div className="px-4">
        {announcementData.map((announcement) => (
          <Alert
            key={announcement.id}
            className="mb-3 min-w-[200px] align-middle drop-shadow-sm"
          >
            <User className="ml-1 h-5 w-5" />
            <AlertTitle className="mb-3 ml-2">
              {announcement.content}
            </AlertTitle>
            <AlertDescription className="ml-2 text-xs text-gray-500">
              @ {announcement.username}
              <p>
                <TimeText date={announcement.createdAt} format="MM/DD h:mm A" />
              </p>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}
