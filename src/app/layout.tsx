import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
    title: "Brainware University | Data Collection",
    description: "This is a data collection form for Brainware University students.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`w-screen h-screen flex items-center justify-center`}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
