import { useMemo } from "react";

import { useSearchParams } from "next/navigation";

import { getAvatar } from "@/lib/utils";
import { useSession } from "next-auth/react";

// this is a helper function to get user info in client components
export default function useUserInfo() {
  const searchParams = useSearchParams();
  const username = useMemo(() => searchParams.get("username"), [searchParams]);
  const handle = useMemo(() => searchParams.get("handle"), [searchParams]);
  const avatarURL = useMemo(() => getAvatar(username), [username]);
  
  const { data: session } = useSession();

  return {
    username,
    handle,
    avatarURL,
    session
  };
}