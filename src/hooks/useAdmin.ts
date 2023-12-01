import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useStorage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createCourse = async ({
    courses,
  }: {
    courses: {
      number: string;
      name: string;
      instructorName: string;
      semester: string;
      departmentName: string;
    }[];
  }) => {
    if (loading) return;

    setLoading(true);

    const res = await fetch("/api/admin/course", {
      method: "POST",
      body: JSON.stringify(courses),
    });

    console.log(res);
    router.push("/course");

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    setLoading(false);
  };

  const createAnnouncement = async ({ content }: { content: string }) => {
    if (loading) return;

    setLoading(true);

    const res = await fetch("/api/admin/announcement", {
      method: "POST",
      body: JSON.stringify({ content }),
    });

    console.log(res);
    router.push("/");
    router.refresh();

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    setLoading(false);
  };

  const setFileStatus = async ({
    fileId,
    status,
  }: {
    fileId: number;
    status: "Private" | "Public";
  }) => {
    if (loading) return;

    setLoading(true);

    const res = await fetch("/api/admin/file", {
      method: "POST",
      body: JSON.stringify({ fileId, status }),
    });

    console.log(res);
    router.push("/");
    router.refresh();

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    setLoading(false);
  };

  return {
    createAnnouncement,
    setFileStatus,
    createCourse,
    loading,
  };
}
