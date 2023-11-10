"use client"

import * as React from "react"

import { storage } from '@/lib/storage';
import { ref, uploadBytesResumable, getDownloadURL, type StorageError } from "firebase/storage"

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
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import useStorage from "@/hooks/useStorage";
import { useRouter } from "next/navigation";

type UploadCardProps = {
    courseData: {
        id: string
    }[]
};

export function UploadCard({
    courseData
}: UploadCardProps) {

    const [contentType, setContentType] = useState<string>('');
    const [courseId, setCourseId] = useState<string>('');
    const [examType, setExamType] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const { createFile } = useStorage();
    const router = useRouter();

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setFile(files[0]);
        }
    };

    const onUpload = () => {
        if (file) {
            const storageRef = ref(storage, `pdf/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    console.log(snapshot);
                },
                (error: StorageError) => {
                    console.error('Upload failed', error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL: string) => {
                        console.log('File available at', downloadURL);
                        try {
                            createFile({
                                courseId, 
                                contentType, 
                                examType, 
                                downloadURL
                            })
                        } catch (error) {
                            console.log(error);
                        } finally {
                            router.push('/');
                        }
                    });
                }
            );
        }
    };

    return (
        <Card className="w-[350px] drop-shadow-md   ">
            <CardHeader>
                <CardTitle>Upload PDF</CardTitle>
                <CardDescription>Upload your PDF in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="type">Course Id</Label>
                            <Select onValueChange={(e) => setCourseId(e)}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {
                                        courseData.map((course) => <SelectItem key={course.id} value={course.id}>{course.id}</SelectItem>)
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="type">Content Type</Label>
                            <Select onValueChange={(e) => setContentType(e)}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="Solution">Solution</SelectItem>
                                    <SelectItem value="Question">Question</SelectItem>
                                    <SelectItem value="Q&S">Q&S</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="type">Exam Type</Label>
                            <Select onValueChange={(e) => setExamType(e)}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="Quiz">Quiz</SelectItem>
                                    <SelectItem value="Midterm">Midterm</SelectItem>
                                    <SelectItem value="Final">Final</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="File">File</Label>
                            <Input id="file" type="file" placeholder="Name of your project" onChange={onFileChange} />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={onUpload}>Upload</Button>
            </CardFooter>
        </Card>
    )
}
