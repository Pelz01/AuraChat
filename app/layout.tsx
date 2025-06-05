import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistSans } from 'geist/font/sans';
import 'katex/dist/katex.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Metadata, Viewport } from "next";
import { Syne } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL("https://scira.ai"),
  title: {
    default: "AuraChat - AI Conversation Coach",
    template: "%s | AuraChat",
    absolute: "AuraChat - AI Conversation Coach",
  },
  description: "AuraChat is an AI-powered conversation coaching tool that helps you navigate social interactions with confidence, authenticity, and strategic thinking.",
  openGraph: {
    url: "https://aurachat.app",
    siteName: "AuraChat",
  },
  keywords: [
    "aurachat",
    "aura chat",
    "conversation coach",
    "ai conversation assistant",
    "social dynamics",
    "conversation skills",
    "dating coach",
    "communication coach",
    "neil strauss",
    "pickup artist",
    "social skills",
    "conversation helper",
    "dating advice",
    "relationship coach",
    "social interaction",
    "confidence building",
    "communication skills",
    "conversation training",
    "social coaching",
    "dating tips",
    "conversation practice",
  ]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' }
  ],
}

const syne = Syne({ 
  subsets: ['latin'], 
  variable: '--font-syne',
   preload: true,
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${syne.variable} font-sans antialiased`} suppressHydrationWarning>
        <NuqsAdapter>
          <Providers>
            <Toaster position="top-center" />
            {children}
          </Providers>
        </NuqsAdapter>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
