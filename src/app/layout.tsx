import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://movieflix-pro.vercel.app'),
  title: "Movieflix Pro - Watch Premium Movies & Web Series Online",
  description: "Stream the latest movies and web series in HD quality. Movieflix Pro offers unlimited entertainment with a vast collection of premium content. Watch now!",
  keywords: ["movies", "web series", "streaming", "watch online", "HD quality", "premium content", "entertainment", "Movieflix Pro"],
  authors: [{ name: "Movieflix Pro" }],
  openGraph: {
    title: "Movieflix Pro - Watch Premium Movies & Web Series Online",
    description: "Stream the latest movies and web series in HD quality. Movieflix Pro offers unlimited entertainment with a vast collection of premium content.",
    url: "https://movieflix-pro.vercel.app",
    siteName: "Movieflix Pro",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Movieflix Pro - Watch Premium Movies & Web Series Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Movieflix Pro - Watch Premium Movies & Web Series Online",
    description: "Stream the latest movies and web series in HD quality. Movieflix Pro offers unlimited entertainment with a vast collection of premium content.",
    images: ["/og-image.jpg"],
    site: "@movieflixpro",
    creator: "@movieflixpro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-site-verification-code",
  },
  other: {
    "theme-color": "#0072ff",
    "msapplication-TileColor": "#0072ff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EntertainmentWebsite",
    "name": "Movieflix Pro",
    "url": "https://movieflix-pro.vercel.app",
    "description": "Stream the latest movies and web series in HD quality. Movieflix Pro offers unlimited entertainment with a vast collection of premium content.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://movieflix-pro.vercel.app/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Movieflix Pro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://movieflix-pro.vercel.app/logo.png"
      }
    },
    "sameAs": [
      "https://facebook.com/movieflixpro",
      "https://twitter.com/movieflixpro",
      "https://instagram.com/movieflixpro"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
