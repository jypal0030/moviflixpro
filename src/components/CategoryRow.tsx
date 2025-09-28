'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HorizontalScroll from './HorizontalScroll';
import MovieCard from './MovieCard';

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

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
}

interface CategoryRowProps {
  category: Category;
  contents: Content[];
  onMovieClick: (content: Content) => void;
}

export default function CategoryRow({ category, contents, onMovieClick }: CategoryRowProps) {
  // The onMovieClick prop is no longer needed since MovieCard handles navigation
  // But we'll keep it for backward compatibility
  return (
    <div>
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-black">{category.name}</h2>
          {category.description && (
            <p className="text-muted-foreground mt-1">{category.description}</p>
          )}
        </div>
        <Button 
          variant="ghost" 
          className="text-primary hover:text-primary/80 group"
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Horizontal Scroll Container */}
      {contents.length > 0 ? (
        <HorizontalScroll>
          {contents.map((content) => (
            <MovieCard
              key={content.id}
              content={content}
              onClick={() => onMovieClick(content)}
            />
          ))}
        </HorizontalScroll>
      ) : (
        <div className="flex items-center justify-center h-32 bg-muted/20 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">No content available in this category yet.</p>
        </div>
      )}
    </div>
  );
}