import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Production Readiness Advisor",
  description:
    "Guided assessment for whether an AI feature is ready for production — structured scores, hard gates, and an advisory report.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
