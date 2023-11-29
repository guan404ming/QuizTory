"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStorage from "@/hooks/useStorage";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  courseId: z.string(),
  contentType: z.enum(["Solution", "Question", "Q&S"]),
  examType: z.enum(["Quiz", "Midterm", "Final"]),
  file: z
    .instanceof(File)
    .refine((file) => file.size < 10000000, {
      message: "File size should be less than 10MB",
    })
    .refine((file) => file.type === "application/pdf", {
      message: "File type should be pdf",
    }),
});

type UploadCardProps = {
  courseData: {
    number: string;
    name: string;
    id: number;
    semester: string;
    instructorId: number;
  }[];
};

export function UploadCard({ courseData }: UploadCardProps) {
  const { loading, createFile } = useStorage();

  // form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createFile({ ...values, courseId: parseInt(values.courseId) });
  }

  return (
    <Card className="w-[350px] drop-shadow-md">
      <CardHeader>
        <CardTitle>Upload PDF</CardTitle>
        <CardDescription>Upload your PDF in one-click.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="text-blue">
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Course Number</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? `${courseData.find(
                                (course) => `${course.id}` === field.value,
                              )?.number} - ${courseData.find(
                                (course) => `${course.id}` === field.value,
                              )?.name}`
                            : "Select course"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search course..." />
                        <CommandEmpty>No course found.</CommandEmpty>
                        <CommandList>
                          {courseData.map((course) => (
                            <CommandItem
                              className="px-4 py-2"
                              value={JSON.stringify(course)}
                              key={`${course.id}`}
                              onSelect={() => {
                                form.setValue("courseId", `${course.id}`);
                              }}
                            >
                              {`${course.number} - ${course.name}`}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      <SelectItem value="Solution">Solution</SelectItem>
                      <SelectItem value="Question">Question</SelectItem>
                      <SelectItem value="Q&S">Q&S</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="examType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Type</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      <SelectItem value="Quiz">Quiz</SelectItem>
                      <SelectItem value="Midterm">Midterm</SelectItem>
                      <SelectItem value="Final">Final</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        if (e.target.files) {
                          field.onChange(e.target.files[0]);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Upload
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
