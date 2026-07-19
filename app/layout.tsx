import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  title: {
    default: "Open Cigar Database",
    template: "%s — Open Cigar Database",
  },
  description:
    "A comprehensive, open source database of cigars built and verified by a global community.",
};

const themeInit = `try{if(localStorage.getItem("ocdb-theme")==="dark"||(!localStorage.getItem("ocdb-theme")&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/*<body className="min-h-full flex flex-col">*/}
      <body className="flex min-h-full w-full min-w-0 flex-col overflow-x-clip">
        {/* Applies the saved theme before first paint to avoid a flash. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static constant, no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <SiteHeader />
        {/*<div className="flex-1">*/}
        <div className="w-full min-w-0 flex-1 overflow-x-clip">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
