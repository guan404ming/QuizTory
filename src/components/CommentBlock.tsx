"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import { MessageCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import useComment from "@/hooks/useComment";

export default function CommentBlock() {
  const { fileId } = useParams();
  const [content, setContent] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { createComment, loading } = useComment();

  const handleSubmit = async () => {
    if (content) {
      try {
        await createComment({ content, fileId: parseInt(fileId as string) });
        toast({
          title: "Successfully created comment 😻",
          description: "See it in the homepage",
        });
        setDialogOpen(false);
      } catch (error) {
        console.log(error);
        toast({
          title: "Something went wrong 😿",
          description: `Error creating comment`,
        });
      }
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger className="text-left">
        <MessageCircleIcon></MessageCircleIcon>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create comment</DialogTitle>
          <DialogDescription>enter the content</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-1.5">
          <Input
            id="file"
            placeholder="Content of your comment"
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
