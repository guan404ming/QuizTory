import { db } from "@/db";
import { fileTable, userTable } from "@/db/schema";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";

import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";

const uploadFileRequestSchema = z.object({
    courseId: z.number(),
    contentType: z.enum(['Solution', 'Question', 'Q&S']),
    examType: z.enum(["Quiz", "Midterm", "Final"]),
    downloadURL: z.string().url()
});

type UploadFileRequest = z.infer<typeof uploadFileRequestSchema>;

export async function POST(request: NextRequest) {
    const data = await request.json();
    console.log(data);

    try {
        uploadFileRequestSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { courseId, contentType, examType, downloadURL } = data as UploadFileRequest;

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) throw Error('No session!');
        
        const [user] = await db
            .select({
                id: userTable.id
            })
            .from(userTable)
            .where(eq(userTable.email, session.user.email));

        await db
          .insert(fileTable)
          .values({
            contentType,
            examType,
            status: 'Private',
            downloadURL,
            courseId,
            userId: user.id
          })
          .onConflictDoNothing()
          .execute();
      } catch (error) {
        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 500 },
        );
      }

    return new NextResponse("OK", { status: 200 });
}