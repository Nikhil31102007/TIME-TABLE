import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body-ui",
  subsets: ["latin"],
});

const displayFont = Space_Grotesk({
  variable: "--font-display-ui",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adaptive Study Planner UI",
  description:
    "A premium interactive study timetable built from a constrained exam preparation plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-clip bg-[var(--bg)] font-sans text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
