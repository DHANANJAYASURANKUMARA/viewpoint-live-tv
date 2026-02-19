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
  title: "VIEWPOINT | Premium Ultra-Low Latency Live Streaming",
  description: "Experience the next evolution of live television with VIEWPOINT. Ultra-low latency, global signal coverage, and a hyper-fluid neural interface for 250+ premium channels.",
  keywords: ["live tv", "streaming service", "4k hdr streaming", "global television", "ultra low latency", "online player"],
  authors: [{ name: "VIEWPOINT Team" }],
  openGraph: {
    title: "VIEWPOINT | Beyond Streaming",
    description: "The next evolution of live television. Ultra-low latency, global signal coverage.",
    type: "website",
    url: "https://viewpoint-premium.vercel.app",
    siteName: "VIEWPOINT",
  },
  twitter: {
    card: "summary_large_image",
    title: "VIEWPOINT | Beyond Streaming",
    description: "Ultra-low latency global streaming interface.",
  },
  alternates: {
    canonical: "https://viewpoint-premium.vercel.app",
  },
};

import MainLayoutWrapper from "@/components/MainLayoutWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <MainLayoutWrapper>
          {children}
        </MainLayoutWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}
