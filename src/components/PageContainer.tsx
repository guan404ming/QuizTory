import React from "react";

type PageContainerProps = {
  children: React.ReactNode;
  emoji: string;
  title: string;
};

export default function PageContainer({
  children,
  emoji,
  title,
}: PageContainerProps) {
  return (
    <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
      <h1 className="bg-white px-5 py-2 text-xl font-bold">
        {emoji} &nbsp;{title}
      </h1>
      {children}
    </div>
  );
}
