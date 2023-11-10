import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useStorage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const createFile = async ({
        courseId,
        contentType,
        examType,
        downloadURL
    }: {
        courseId: string,
        contentType: string,
        examType: string,
        downloadURL: string
    }) => {
        if (loading) return;

        setLoading(true);
        const res = await fetch("/api/storage", {
            method: "POST",
            body: JSON.stringify({
                courseId,
                contentType,
                examType,
                downloadURL
            }),
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
        createFile,
        loading,
    };
}
