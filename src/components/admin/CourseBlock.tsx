"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useAdmin from "@/hooks/useAdmin";

export default function CourseBlock() {
  const [file, setFile] = useState<File | null>(null);
  const { createCourse, loading } = useAdmin();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const rawCourses: {
          course_id: string;
          course_name: string;
          instructor_name: string;
          semester: string;
          department_name: string;
        }[] = JSON.parse(e.target?.result as string);

        const courses = rawCourses.map((rawCourse) => ({
          number: rawCourse.course_id,
          name: rawCourse.course_name,
          instructorName: rawCourse.instructor_name,
          semester: rawCourse.semester,
          departmentName: rawCourse.department_name,
        }));

        try {
          await createCourse({ courses });
          toast({
            title: `Successfully created ${courses.length} courses 😻`,
            description: "See it in the course page",
          });
        } catch (error) {
          console.log(error);
          toast({
            title: "Something went wrong 😿",
            description: `Error creating courses`,
          });
        }
      };

      reader.onerror = (e: ProgressEvent<FileReader>) => {
        console.error("File reading failed: ", e.target?.error);
      };
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="text-left">
        <Card className="cursor-pointer">
          <CardHeader>
            <CardTitle>Course</CardTitle>
            <CardDescription>Upload courses to DB</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Courses</DialogTitle>
          <DialogDescription>upload courses json</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-1.5">
          <Input
            id="file"
            type="file"
            placeholder="Name of your project"
            onChange={onFileChange}
          />
        </div>

        <DialogFooter>
          <Button
            className="round-xl"
            onClick={() => handleSubmit()}
            disabled={loading}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
