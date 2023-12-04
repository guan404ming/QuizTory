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

export default function AnnouncementBlock() {
  const [content, setContent] = useState<string>("");
  const { createAnnouncement, loading } = useAdmin();

  const handleSubmit = async () => {
    if (content) {
      try {
        await createAnnouncement({ content });
        toast({
          title: "Successfully created announcement 😻",
          description: "See it in the homepage",
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Something went wrong 😿",
          description: `Error creating announcement`,
        });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="text-left">
        <Card className="cursor-pointer">
          <CardHeader>
            <CardTitle>Announcement</CardTitle>
            <CardDescription>Create announcement</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create announcement</DialogTitle>
          <DialogDescription>enter the content</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-1.5">
          <Input
            id="file"
            placeholder="Content of your announcement"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            disabled={loading}
            className="round-xl"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
