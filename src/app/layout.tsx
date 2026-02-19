import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIEWPOINT | Ultra-Premium Live Streaming",
  description: "Experience the pulse of global broadcasting with VIEWPOINT. Ultra-low latency, 4K HDR signals, and a futuristic 'Zero-Lag' interface designed for maximum digital density.",
  keywords: ["live tv", "streaming", "4k live", "ultra-low latency", "premium streaming", "hls viewer", "dash player"],
  authors: [{ name: "VIEWPOINT Systems" }],
  openGraph: {
    title: "VIEWPOINT | Ultra-Premium Live Streaming",
    description: "The future of atmospheric live television. Global signal coverage and military-grade stability.",
    type: "website",
    url: "https://viewpoint-live.vercel.app",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIEWPOINT Live",
    description: "Atmospheric Live Television Engine",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://viewpoint-live.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import MainLayoutWrapper from "@/components/MainLayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense Placeholder */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-neon-cyan/30`}
      >
        <MainLayoutWrapper>
          {children}
        </MainLayoutWrapper>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
