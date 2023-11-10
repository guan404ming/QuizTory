"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { signIn, signOut } from 'next-auth/react';

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

export default function NameDialog() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { session } = useUserInfo();

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
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Welcome to Quiztory!</DialogTitle>
                    <DialogDescription>
                        Sign in to get all Quiztory~~
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button className='round-xl mr-5' onClick={() => signIn()}>Sign In</Button>
                    <Button className='round-xl' onClick={() => signOut()}>Sign Out</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
