import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Production Readiness Advisor",
  description:
    "Guided assessment for whether an AI feature is ready for production — structured scores, hard gates, and an advisory report.",
  applicationName: "AI Production Readiness Advisor",
  authors: [{ name: "Weidong Shi", url: "https://weidong-shi.com" }],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
