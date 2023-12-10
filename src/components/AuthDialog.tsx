"use client";

import { useEffect, useState } from "react";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useUserInfo from "@/hooks/useUserInfo";

export default function AuthDialog() {
  const { session } = useUserInfo();
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const open = searchParams.get("open");

    if (open) {
      setDialogOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (session && session.user) {
      setDialogOpen(false);
      router.push("/");
    } else {
      setDialogOpen(true);
    }
  }, [router, session]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setDialogOpen(true);
    } else {
      session && setDialogOpen(false);
      router.push("/");
    }
  };

  return (
    <Dialog
      open={session?.user.role === "Blocked" || dialogOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-w-[300px] sm:max-w-[425px]">
        {session?.user.role === "Blocked" ? (
          <DialogHeader>
            <DialogTitle>You are blocked 🙀</DialogTitle>
            <DialogDescription>
              Contact us to get more infomation
            </DialogDescription>
            <DialogFooter>
              <Button
                className="round-xl mt-4 w-full"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </DialogFooter>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Welcome to Quiztory!</DialogTitle>
              <DialogDescription>
                Sign in to get all Quiztory~~
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button className="round-xl" onClick={() => signIn()}>
                Sign In
              </Button>
              <Button className="round-xl" onClick={() => signOut()}>
                Sign Out
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
