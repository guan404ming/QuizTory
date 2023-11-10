"use client";

import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  className?: string;
};

export default function UserAvatar({ className }: UserAvatarProps) {
  const { session } = useUserInfo();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={session?.user?.image as string}
      alt="user avatar"
      width={48}
      height={48}
      className={cn(className, "rounded-full")}
    />
  );
}
