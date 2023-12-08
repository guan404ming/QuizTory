"use client";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

export const fileColumns: ColumnDef<{
  id: number;
  contentType: "Solution" | "Question" | "Q&S";
  examType: "Quiz" | "Midterm" | "Final";
  downloadURL: string | null;
  courseName: string;
  courseNumber: string;
}>[] = [
  {
    accessorKey: "courseNumber",
    header: "Course Number",
  },
  {
    accessorKey: "courseName",
    header: "Course Name",
  },
  {
    accessorKey: "examType",
    header: "Exam",
  },
  {
    accessorKey: "contentType",
    header: "Content",
  },
  {
    accessorKey: "downloadURL",
    header: "File",
    cell: ({ row }) => (
      <Link
        className="text-blue-500 underline"
        target="_blank"
        href={row.getValue("downloadURL")}
      >
        Link
      </Link>
    ),
  },
];

export const courseColumns: ColumnDef<{
  id: number;
  semester: string;
  name: string;
  instructor_id: number;
  instructor_name: string;
}>[] = [
  {
    accessorKey: "number",
    header: "Number",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "semester",
    header: "Semester",
  },
  {
    accessorKey: "instructor_name",
    header: "Instructor",
  },
];
