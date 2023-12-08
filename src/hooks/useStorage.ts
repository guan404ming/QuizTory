import { useState } from "react";

import { useRouter } from "next/navigation";

import { signInAnonymously } from "firebase/auth";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type StorageError,
} from "firebase/storage";

import { storage, auth } from "@/lib/storage";

export default function useStorage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgess] = useState(0);
  const router = useRouter();

  const createFile = async ({
    courseId,
    contentType,
    examType,
    file,
  }: {
    courseId: number;
    contentType: "Solution" | "Question" | "Q&S";
    examType: "Quiz" | "Midterm" | "Final";
    file: File;
  }) => {
    if (loading) return;

    signInAnonymously(auth).then(() => {
      // User is signed in anonymously
      const storageRef = ref(storage, `pdf/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setLoading(true);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgess((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error: StorageError) => {
          console.error("Upload failed", error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL: string) => {
              try {
                const res = await fetch("/api/storage", {
                  method: "POST",
                  body: JSON.stringify({
                    courseId,
                    contentType,
                    examType,
                    downloadURL,
                  }),
                });

                console.log(res);

                if (!res.ok) {
                  const body = await res.json();
                  throw new Error(body.error);
                }

                router.push("/");
                router.refresh();
                setLoading(false);
              } catch (error) {
                console.log(error);
              }
            },
          );
        },
      );
    });
  };

  return {
    createFile,
    progress,
    loading,
  };
}
