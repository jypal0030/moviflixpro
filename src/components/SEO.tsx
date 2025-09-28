import { usePathname } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
  noIndex?: boolean;
  structuredData?: any;
}

export default function SEO({
  title = 'Movieflix Pro - Watch Premium Movies & Web Series Online',
  description = 'Stream the latest movies and web series in HD quality. Movieflix Pro offers unlimited entertainment with a vast collection of premium content. Watch now!',
  keywords = 'movies, web series, streaming, watch online, HD quality, premium content, entertainment, Movieflix Pro',
  image = '/og-image.jpg',
  url,
  type = 'website',
  siteName = 'Movieflix Pro',
  locale = 'en_US',
  noIndex = false,
  structuredData
}: SEOProps) {
  const pathname = usePathname();
  const currentUrl = url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://movieflix-pro.vercel.app'}${pathname}`;

  const structuredDataDefault = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://movieflix-pro.vercel.app',
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://movieflix-pro.vercel.app'}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://movieflix-pro.vercel.app'}/logo.png`
      }
    }
  };

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Movieflix Pro" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@movieflixpro" />
      <meta name="twitter:creator" content="@movieflixpro" />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#0072ff" />
      <meta name="msapplication-TileColor" content="#0072ff" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {!structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataDefault)
          }}
        />
      )}
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  );
}