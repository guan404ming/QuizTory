import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";

import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";

import "./globals.css";
import NextAuthProvider from "@/context/NextAuthProvider";

const noto = Noto_Sans({
    subsets: ["latin-ext"],
    weight: ["400", "700"],
    variable: "--noto-sans",
});

export const metadata: Metadata = {
    title: "quiztory",
    description: "Generated by create next app",
    icons: "/favicon.ico",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <NextAuthProvider>
                {/* this applies the font to the whole page */}
                <body className={noto.className}>
                    <div className="mx-auto flex max-w-6xl">
                        <Header />
                        <main className="flex min-h-screen w-full">
                            <Separator orientation="vertical" />
                            {children}
                            <Separator orientation="vertical" />
                        </main>
                    </div>
                </body>
            </NextAuthProvider>

        </html>
    );
}