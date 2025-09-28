'use client';

import { useEffect, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import HorizontalScroll from '@/components/HorizontalScroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

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

export default function MoviesPage() {
  const [movies, setMovies] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    year: 'all',
    sortBy: 'rating'
  });

  useEffect(() => {
    fetchMovies();
    fetchCategories();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/content/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredMovies = movies.filter(movie => {
    if (filters.category !== 'all' && movie.category?.slug !== filters.category) {
      return false;
    }
    if (filters.year !== 'all' && movie.year?.toString() !== filters.year) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'year':
        return (b.year || 0) - (a.year || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getAvailableYears = () => {
    const years = new Set<number>();
    movies.forEach(movie => {
      if (movie.year) {
        years.add(movie.year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
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
              <h1 className="text-2xl font-bold text-primary">Movies</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>
          
          <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className="w-40 bg-background border-border text-foreground">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.filter(cat => cat.contentType === 'MOVIE').map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.year} onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}>
            <SelectTrigger className="w-32 bg-background border-border text-foreground">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {getAvailableYears().map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
            <SelectTrigger className="w-32 bg-background border-border text-foreground">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Movies Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              All Movies
            </h2>
            <span className="text-muted-foreground">
              {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
            </span>
          </div>

          {filteredMovies.length > 0 ? (
            <HorizontalScroll>
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  content={movie}
                  onClick={() => {
                    window.location.href = `/movie/${movie.id}`;
                  }}
                />
              ))}
            </HorizontalScroll>
          ) : (
            <div className="flex items-center justify-center py-12 bg-muted/20 rounded-lg border border-dashed border-border">
              <p className="text-muted-foreground">No movies found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}