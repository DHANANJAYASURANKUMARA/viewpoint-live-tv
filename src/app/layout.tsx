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
  title: "VIEWPOINT - Premium Live TV | Watch Free T20 World Cup & Cricket Live",
  description: "Access high-fidelity live TV transmissions. Watch T20 World Cup, IPL, Cricket, Football, and global news fragments free. HD fidelity, zero-cost access. No registration required.",
  keywords: [
    "watch live tv free",
    "premium live tv streaming",
    "T20 World Cup live transmission",
    "cricket live match free HD",
    "watch live cricket online free",
    "free live football streaming",
    "live news fragments",
    "HD signal multiplexer",
    "VIEWPOINT neural live",
    "IPL live stream free"
  ],
  authors: [{ name: "VIEWPOINT Neural Systems", url: "https://viewpointlivetv.com" }],
  creator: "VIEWPOINT M-CORE",
  publisher: "VIEWPOINT Systems",
  category: "Sports & Entertainment",
  openGraph: {
    title: "VIEWPOINT - Universal Live TV Synchronization | T20 & Cricket",
    description: "Military-grade live TV streaming. Watch T20 World Cup, Football, and News fragments free. Zero-cost synchronization.",
    type: "website",
    url: "https://viewpointlivetv.com",
    siteName: "VIEWPOINT Neural Nexus",
    locale: "en_US",
    images: [
      {
        url: "https://viewpointlivetv.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VIEWPOINT Neural Nexus - Global Transmission"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIEWPOINT - Global Live TV Signal | Cricket & T20 free",
    description: "High-fidelity HD streaming — Cricket, T20 World Cup, and Entertainment. Initialize transmission now.",
    images: ["https://viewpointlivetv.com/og-image.jpg"],
    creator: "@viewpointnexus",
  },
  alternates: {
    canonical: "https://viewpointlivetv.com",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "viewpoint-google-verification-token",
  },
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
        <link rel="apple-touch-icon" href="/icon.png" />
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "VIEWPOINT Live TV",
            "url": "https://viewpoint-live.vercel.app",
            "description": "Watch live TV free online. Stream T20 World Cup, cricket live match, football, news and entertainment 24/7 for free.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://viewpoint-live.vercel.app/watch?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "VIEWPOINT",
              "url": "https://viewpoint-live.vercel.app",
              "logo": {
                "@type": "ImageObject",
                "url": "https://viewpoint-live.vercel.app/icon.png"
              }
            }
          })
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "Live TV Streaming — Cricket, T20, Football, News",
            "description": "Watch live cricket, T20 World Cup, IPL, football, and 200+ free live TV channels online in HD quality. No subscription required.",
            "thumbnailUrl": "https://viewpoint-live.vercel.app/og-image.jpg",
            "uploadDate": "2026-01-01",
            "contentUrl": "https://viewpoint-live.vercel.app/watch",
            "embedUrl": "https://viewpoint-live.vercel.app/watch"
          })
        }} />
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
