"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CommandInput,
  CommandEmpty,
  CommandItem,
  Command,
} from "@/components/ui/command";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import useAdmin from "@/hooks/useAdmin";

type FileBlockProps = {
  fileData: {
    status: "Public" | "Private";
    id: number;
    contentType: "Solution" | "Question" | "Q&S";
    examType: "Quiz" | "Midterm" | "Final";
    downloadURL: string | null;
    courseId: number;
    userId: number;
  }[];
};

export default function FileBlock({ fileData }: FileBlockProps) {
  const [open, setOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [status, setStatus] = useState<"Public" | "Private">("Private");
  const { setFileStatus, loading } = useAdmin();

  function getLabelById() {
    const file = fileData.find((file) => `${file.id}` === selectedFileId);
    if (file) {
      return `${file.courseId} - ${file.examType} - ${file.contentType} - (user-${file.userId})`;
    } else {
      return "File not found!";
    }
  }

  const handleSubmit = async () => {
    const file = fileData.find((file) => `${file.id}` === selectedFileId);
    if (!file) return;
    try {
      await setFileStatus({ fileId: file.id, status });
      toast({
        title: `Successfully set ${file.id} to ${status} 😻`,
        description: "See it in the homepage",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong 😿",
        description: `Error setting file status`,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="text-left">
        <Card className="cursor-pointer">
          <CardHeader>
            <CardTitle>File</CardTitle>
            <CardDescription>Toggle file status</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Toggle file status</DialogTitle>
          <DialogDescription>upload courses json</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          <p className="my-4 font-bold">File</p>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
              >
                {selectedFileId ? getLabelById() : "Select file..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="z-10 w-[375px] p-0 drop-shadow-lg"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search file..." />
                <CommandEmpty>No file found.</CommandEmpty>
                {fileData.map((file) => (
                  <CommandItem
                    key={file.id}
                    className="px-4"
                    value={JSON.stringify(file)}
                    onSelect={(currentValue) => {
                      setSelectedFileId(
                        currentValue === selectedFileId ? "" : `${file.id}`,
                      );
                      setStatus(file.status);
                      setOpen(false);
                    }}
                  >
                    {`${file.courseId} - ${file.examType} - ${file.contentType} - (user-${file.userId})`}
                  </CommandItem>
                ))}
              </Command>
            </PopoverContent>
          </Popover>

          <p className="my-4 font-bold">Status</p>

          <Select
            onValueChange={(value: "Private" | "Public") => setStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
