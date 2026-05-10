import type { Metadata } from "next";
import "./globals.css";
import { inter, playfair } from "@/lib/fonts";
// import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

// const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Find the best time and prices to travel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", `${inter.variable} ${playfair.variable}`)}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
