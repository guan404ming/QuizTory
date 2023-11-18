// type AdminPageProps = {};

import CourseBlock from "@/components/admin/CourseBlock";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default async function AdminPage() {

    return (
        <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
            <h1 className="py-4 bg-white px-4 text-xl font-bold">Admin</h1>
            <div className="grid grid-cols-2 gap-4 px-4">
                <Card className="cursor-pointer">
                    <CardHeader>
                        <CardTitle>Announcement</CardTitle>
                        <CardDescription>Create announcement</CardDescription>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                </Card>

                <CourseBlock></CourseBlock>

                <Card className="cursor-pointer">
                    <CardHeader>
                        <CardTitle>File</CardTitle>
                        <CardDescription>Approve uploaded files</CardDescription>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer">
                    <CardHeader>
                        <CardTitle>Roles</CardTitle>
                        <CardDescription>Change user roles</CardDescription>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
