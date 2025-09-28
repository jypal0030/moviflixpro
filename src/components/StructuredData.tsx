interface MovieStructuredDataProps {
  movie: {
    id: string;
    title: string;
    description?: string;
    posterUrl?: string;
    year?: number;
    duration?: string;
    rating?: number;
    quality?: string;
    contentType: 'MOVIE' | 'WEB_SERIES';
    category?: {
      name: string;
    };
  };
}

export function MovieStructuredData({ movie }: MovieStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": movie.contentType === 'MOVIE' ? "Movie" : "TVSeries",
    "name": movie.title,
    "description": movie.description || `Watch ${movie.title} online in HD quality on Movieflix Pro`,
    "image": movie.posterUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://movieflix-pro.vercel.app'}/placeholder-movie.jpg`,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://movieflix-pro.vercel.app'}/movie/${movie.id}`,
    "dateCreated": movie.year ? `${movie.year}-01-01` : new Date().toISOString().split('T')[0],
    "genre": movie.category?.name || "Drama",
    "aggregateRating": movie.rating ? {
      "@type": "AggregateRating",
      "ratingValue": movie.rating.toString(),
      "bestRating": "10",
      "worstRating": "1",
      "ratingCount": "1000"
    } : undefined,
    "duration": movie.duration ? `PT${movie.duration.replace('h', 'H').replace('m', 'M')}` : undefined,
    "quality": movie.quality,
    "potentialAction": {
      "@type": "WatchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://movieflix-pro.vercel.app'}/movie/${movie.id}`,
        "inLanguage": "en",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "object": {
        "@type": "Movie",
        "name": movie.title
      },
      "result": {
        "@type": "WatchAction"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Movieflix Pro",
      "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://movieflix-pro.vercel.app'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: {
    name: string;
    url: string;
  }[];
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}

interface WebsiteStructuredDataProps {
  name: string;
  description: string;
  url: string;
  searchUrl?: string;
}

export function WebsiteStructuredData({ name, description, url, searchUrl }: WebsiteStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "description": description,
    "url": url,
    "potentialAction": searchUrl ? {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": searchUrl
      },
      "query-input": "required name=search_term_string"
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": name,
      "logo": {
        "@type": "ImageObject",
        "url": `${url}/logo.png`
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}