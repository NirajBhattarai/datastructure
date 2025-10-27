import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Structure Visualizer | Interactive Learning Platform",
  description: "Master data structures through interactive animations and visualizations. Learn Stack, Linked List, Heap, and more with step-by-step visual guides.",
  keywords: "data structures, algorithms, visualization, learning, programming, computer science",
  authors: [{ name: "Niraj Bhattarai" }],
  openGraph: {
    title: "Data Structure Visualizer",
    description: "Interactive data structure learning platform with animations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
