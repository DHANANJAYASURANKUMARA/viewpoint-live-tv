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
  title: "VIEWPOINT - Watch Live TV Free | Cricket, T20 World Cup, Football Live Streaming",
  description: "Watch live TV channels free online. Stream T20 World Cup, cricket live match, football, news, entertainment 24/7. Free live streaming with HD quality. No subscription needed.",
  keywords: [
    "live tv free",
    "watch live tv online",
    "live cricket streaming",
    "T20 World Cup live",
    "free live match",
    "cricket live match today",
    "watch T20 live free",
    "live football streaming",
    "free live tv channels",
    "HD live streaming",
    "IPL live streaming free",
    "live sports streaming",
    "watch live cricket online free",
    "free online tv",
    "live news streaming",
    "entertainment live channels",
    "live match today free",
    "streaming live tv",
    "watch live match without subscription",
    "VIEWPOINT live TV"
  ],
  authors: [{ name: "VIEWPOINT Systems", url: "https://viewpoint-live.vercel.app" }],
  creator: "VIEWPOINT Systems",
  publisher: "VIEWPOINT",
  category: "Entertainment",
  openGraph: {
    title: "VIEWPOINT - Watch Live TV Free | Cricket, T20, Football Live",
    description: "Free live TV streaming — T20 World Cup, cricket, football, news & entertainment. HD quality, no subscription required.",
    type: "website",
    url: "https://viewpoint-live.vercel.app",
    siteName: "VIEWPOINT Live TV",
    locale: "en_US",
    images: [
      {
        url: "https://viewpoint-live.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VIEWPOINT - Free Live TV Streaming"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIEWPOINT - Watch Live TV Free | Cricket & T20 World Cup",
    description: "Free HD live streaming — Cricket, T20 World Cup, Football, News & Entertainment. Watch free live TV now.",
    images: ["https://viewpoint-live.vercel.app/og-image.jpg"],
    creator: "@viewpointlive",
  },
  alternates: {
    canonical: "https://viewpoint-live.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "viewpoint-google-verify",
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
