import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/tokens.css";
import "@/styles/typography.css";
import "@/styles/utilities.css";
import "./globals.css";

// A2F Design System fonts, shared by the public site and the admin.
// Exposed as variables only, so nothing changes until a style opts in (the legacy
// public pages keep their current look until they are rebuilt).
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hanken",
  display: "swap",
});

// Pretendard is not on Google Fonts: official dynamic-subset build (downloads only the
// glyph ranges a page uses). Version pinned.
const PRETENDARD_CSS =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

export const metadata: Metadata = {
  title: "A2F",
  description: "Access To Flux",
};

// Shared by the public site and the admin; each area adds its own chrome in a nested layout.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={hanken.variable}>
      <head>
        <link rel="stylesheet" href={PRETENDARD_CSS} crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
