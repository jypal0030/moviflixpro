'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/custom-select';
import { Card, CardContent } from '@/components/ui/card';
import MovieCard from '@/components/MovieCard';
import HorizontalScroll from '@/components/HorizontalScroll';
import { useRouter } from 'next/navigation';

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

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all'
  });

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchTerm,
        type: filters.type
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('q', searchQuery);
    window.history.pushState({}, '', url.toString());
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setFilters({ type: 'all' });
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.pushState({}, '', url.toString());
  };

  const handleBack = () => {
    router.back();
  };

  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case 'HD':
        return 'bg-blue-500';
      case 'FULL_HD':
        return 'bg-green-500';
      case 'FOUR_K':
        return 'bg-purple-500';
      case 'EIGHT_K':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleMovieClick = (telegramUrl: string) => {
    // This function is no longer needed since MovieCard navigates to detail page
    // But we'll keep it for backward compatibility
    if (telegramUrl) {
      window.open(telegramUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBack}
                className="hover:bg-gray-800 text-gray-300 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-white">Search</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <Card className="bg-black/40 backdrop-blur-sm border-gray-800/50 shadow-lg mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title..."
                    className="pl-10 bg-black/20 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                {searchQuery && (
                  <Button type="button" variant="outline" onClick={clearSearch} className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Search in:</span>
                </div>
                
                <Select 
                  value={filters.type} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                  items={[
                    { value: 'all', label: 'All Content' },
                    { value: 'MOVIE', label: 'Movies' },
                    { value: 'WEB_SERIES', label: 'Web Series' }
                  ]}
                  placeholder="All Content"
                  className="w-40 bg-black/20 border-gray-700 text-white"
                />
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : searchQuery ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Search Results for "{searchQuery}"
                </h2>
                <span className="text-gray-300 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-gray-700">
                  {results.length} {results.length === 1 ? 'result' : 'results'}
                </span>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {results.map((content) => (
                    <div 
                      key={content.id} 
                      className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `/movie/${content.id}`;
                      }}
                    >
                      <div className="relative overflow-hidden rounded-lg shadow-lg bg-black/40 border border-gray-800/50">
                        {/* Movie Poster */}
                        <div className="relative aspect-[2/3] overflow-hidden">
                          <img
                            src={content.posterUrl || '/placeholder-movie.jpg'}
                            alt={content.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-movie.jpg';
                            }}
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-white text-center p-4">
                              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-sm font-medium">Watch Now</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quality Badge */}
                        {content.quality && (
                          <div className={`absolute top-2 right-2 ${getQualityColor(content.quality)} text-white text-xs px-2 py-1 rounded-full font-semibold z-10`}>
                            {content.quality}
                          </div>
                        )}
                        
                        {/* Content Type Badge */}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                          {content.contentType === 'MOVIE' ? 'Movie' : 'Series'}
                        </div>
                      </div>
                      
                        {/* Movie Info */}
                      <div className="mt-3 px-1">
                        <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {content.title}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          {content.year && (
                            <span className="text-gray-400 text-xs">
                              {content.year}
                            </span>
                          )}
                          {content.rating && (
                            <div className="flex items-center gap-1">
                              <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-gray-400 text-xs">{content.rating}</span>
                            </div>
                          )}
                        </div>
                        {content.category && (
                          <p className="text-gray-500 text-xs mt-1">
                            {content.category.name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="bg-black/40 backdrop-blur-sm border-gray-800/50 shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      No results found
                    </h3>
                    <p className="text-gray-300 text-center max-w-md">
                      Try searching with different keywords in movie or web series titles.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-black/40 backdrop-blur-sm border-gray-800/50 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Search Movies & Web Series
                </h3>
                <p className="text-gray-300 text-center max-w-md mb-6">
                  Enter a movie or web series title to search
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}