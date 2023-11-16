"use client"

import * as React from "react"

import * as z from "zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import useStorage from "@/hooks/useStorage";

const formSchema = z.object({
    courseId: z.string(),
    contentType: z.enum(['Solution', 'Question', 'Q&S']),
    examType: z.enum(["Quiz", "Midterm", "Final"]),
    file: z
        .instanceof(File)
        .refine(file => file.size < 10000000, {
            message: "File size should be less than 10MB",
        })
        .refine(file => file.type === "application/pdf", {
            message: "File type should be pdf",
        })
});

type UploadCardProps = {
    courseData: {
        id: string
    }[]
};

export function UploadCard({
    courseData
}: UploadCardProps) {
    const { createFile } = useStorage();

    // form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        createFile({...values})
    };

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
                                <FormItem>
                                    <FormLabel>Course Id</FormLabel>

                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent position="popper">
                                            {
                                                courseData.map((course) => <SelectItem key={course.id} value={course.id}>{course.id}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contentType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content Type</FormLabel>

                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="examType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Exam Type</FormLabel>

                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Button variant="outline">Cancel</Button>
                        <Button type="submit">Upload</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}