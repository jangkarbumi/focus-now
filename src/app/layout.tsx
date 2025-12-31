import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { PomodoroProvider } from "@/context/PomodoroContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FocusNOW",
  icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico'
  },
  description: "Let's focus on our task!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <PomodoroProvider>
            {children}  
          </PomodoroProvider>
        </body>
    </html>
  );
}
