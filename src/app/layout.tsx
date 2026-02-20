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
import { ConfigProvider } from "@/components/ConfigContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VIEWPOINT" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7818560020455484"
          crossOrigin="anonymous"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-neon-cyan/30`}
      >
        <ConfigProvider>
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
          <SpeedInsights />
          <Analytics />
        </ConfigProvider>
      </body>
    </html>
  );
}
