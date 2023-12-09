import { useState } from "react";

import { useRouter } from "next/navigation";

import useUserInfo from "./useUserInfo";

export default function useComment() {
  const { session } = useUserInfo();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createComment = async ({
    fileId,
    content,
  }: {
    fileId: number;
    content: string;
  }) => {
    if (loading || !session?.user.email) {
      throw new Error("Authentication Error");
    }

    setLoading(true);

    const res = await fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({ content, fileId }),
    });

    console.log(res);

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  return {
    createComment,
    loading,
  };
}
