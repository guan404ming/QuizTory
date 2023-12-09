import { useState } from "react";

import { useRouter } from "next/navigation";

import useUserInfo from "./useUserInfo";

export default function useAdmin() {
  const { session } = useUserInfo();
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
    if (loading || session?.user.role !== "Admin") {
      throw new Error("Authentication Error");
    }

    setLoading(true);

    const res = await fetch("/api/admin/course", {
      method: "POST",
      body: JSON.stringify(courses),
    });

    console.log(res);

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.push("/course");
    setLoading(false);
  };

  const createAnnouncement = async ({ content }: { content: string }) => {
    if (loading || session?.user.role !== "Admin") {
      throw new Error("Authentication Error");
    }

    setLoading(true);

    const res = await fetch("/api/admin/announcement", {
      method: "POST",
      body: JSON.stringify({ content }),
    });

    console.log(res);

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.push("/");
    router.refresh();
    setLoading(false);
  };

  const setFileStatus = async ({
    fileId,
    status,
  }: {
    fileId: number;
    status: "Private" | "Public";
  }) => {
    if (loading || session?.user.role !== "Admin") {
      throw new Error("Authentication Error");
    }

    setLoading(true);

    const res = await fetch("/api/admin/file", {
      method: "POST",
      body: JSON.stringify({ fileId, status }),
    });

    console.log(res);

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.push("/");
    router.refresh();

    setLoading(false);
  };

  const setUserRole = async ({
    changeeId,
    role,
  }: {
    changeeId: number;
    role: "Admin" | "Blocked" | "Normal";
  }) => {
    if (loading || session?.user.role !== "Admin") {
      throw new Error("Authentication Error");
    }

    setLoading(true);

    const res = await fetch("/api/admin/user", {
      method: "POST",
      body: JSON.stringify({ changeeId, role }),
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
    createAnnouncement,
    setFileStatus,
    setUserRole,
    createCourse,
    loading,
  };
}
