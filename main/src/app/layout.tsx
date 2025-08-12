// main/src/app/layout.tsx
import type { Metadata } from "next";
// The next/font import has been removed to fix the Turbopack issue.
import "./globals.css";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Track your personal finances with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* The "Inter" font is now imported directly from Google Fonts. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="container py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
