'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Film, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import HorizontalScroll from '@/components/HorizontalScroll';
import MovieCard from '@/components/MovieCard';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
}

interface Content {
  id: string;
  title: string;
  description?: string;
  posterUrl?: string;
  year?: number;
  duration?: string;
  rating?: number;
  quality?: string;
  telegramUrl?: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contentByCategory, setContentByCategory] = useState<Record<string, Content[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const categoriesData = await response.json();
      setCategories(categoriesData);

      // Fetch content for each category
      const contentByCategoryMap: Record<string, Content[]> = {};
      for (const category of categoriesData) {
        const contentResponse = await fetch(`/api/content/category/${category.slug}`);
        const contentData = await contentResponse.json();
        contentByCategoryMap[category.id] = contentData;
      }
      setContentByCategory(contentByCategoryMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (telegramUrl: string) => {
    // This function is no longer needed since MovieCard navigates to detail page
    // But we'll keep it for backward compatibility
    if (telegramUrl) {
      window.open(telegramUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-primary">Categories</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <div className="space-y-8">
          {categories.map((category) => (
            <section key={category.id} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {category.contentType === 'MOVIE' ? (
                      <Film className="h-6 w-6 text-primary" />
                    ) : (
                      <Tv className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{category.name}</h2>
                    {category.description && (
                      <p className="text-lg text-gray-100 mt-1 leading-relaxed">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {contentByCategory[category.id]?.length || 0} items
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      window.location.href = `/category/${category.slug}`;
                    }}
                  >
                    View All
                  </Button>
                </div>
              </div>

              {/* Content Preview */}
              {contentByCategory[category.id] && contentByCategory[category.id].length > 0 ? (
                <HorizontalScroll>
                  {contentByCategory[category.id].slice(0, 6).map((content) => (
                    <MovieCard
                      key={content.id}
                      content={content}
                      onClick={() => {
                        window.location.href = `/movie/${content.id}`;
                      }}
                    />
                  ))}
                </HorizontalScroll>
              ) : (
                <Card className="bg-muted/20 border-border">
                  <CardContent className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">No content available in this category yet.</p>
                  </CardContent>
                </Card>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}