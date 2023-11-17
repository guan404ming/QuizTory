import AuthDialog from "@/components/AuthDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/db";
import { courseTable, fileTable, userTable } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {

    const session = await getServerSession(authOptions);

    if (session?.user) {
        await db
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
            .execute();
    }

    const fileData = await db
        .select({
            id: fileTable.id,
            contentType: fileTable.contentType,
            courseName: courseTable.name,
            downloadURL: fileTable.downloadURL
        })
        .from(fileTable)
        .innerJoin(courseTable, eq(fileTable.courseId, courseTable.id))
        .execute();

    if (!fileData) {
        redirect(`/`);
    }

    return (
        <>
            <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
                <h1 className="py-4 bg-white px-4 text-xl font-bold">Home</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course Name</TableHead>
                            <TableHead>Content Type</TableHead>
                            <TableHead>File</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            fileData.map((file) => (
                                <TableRow key={file.id}>
                                    <TableCell className="font-medium">{file.courseName}</TableCell>
                                    <TableCell>{file.contentType}</TableCell>
                                    <TableCell className="underline text-blue-500">
                                        <Link target="_blank" href={file.downloadURL as string}>Link</Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        }

                    </TableBody>
                </Table>
            </div>
            <AuthDialog />
        </>
    );
}
