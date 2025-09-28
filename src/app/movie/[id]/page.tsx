'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Play, 
  Star, 
  Calendar, 
  Clock, 
  Film, 
  Tv,
  Share2,
  Heart,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import HorizontalScroll from '@/components/HorizontalScroll';
import MovieCard from '@/components/MovieCard';

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
  createdAt: string;
  updatedAt: string;
}

interface RelatedContent {
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

function MovieDetailContent() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;
  
  const [movie, setMovie] = useState<Content | null>(null);
  const [relatedContent, setRelatedContent] = useState<RelatedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      // Fetch movie details
      const response = await fetch(`/api/content/${movieId}`);
      const movieData = await response.json();
      
      if (response.ok) {
        setMovie(movieData);
        
        // Fetch related content (same category)
        if (movieData.categoryId) {
          const relatedResponse = await fetch(`/api/content/category/${movieData.category.slug}`);
          const relatedData = await relatedResponse.json();
          // Filter out current movie and limit to 6 items
          const filteredRelated = relatedData
            .filter((item: RelatedContent) => item.id !== movieId)
            .slice(0, 6);
          setRelatedContent(filteredRelated);
        }
      } else {
        console.error('Movie not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchNow = () => {
    if (movie?.telegramUrl) {
      window.open(movie.telegramUrl, '_blank');
    }
  };

  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case 'HD': return 'bg-blue-500';
      case 'FULL_HD': return 'bg-green-500';
      case 'FOUR_K': return 'bg-purple-500';
      case 'EIGHT_K': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleRelatedMovieClick = (telegramUrl: string) => {
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

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Movie not found</h1>
          <Button onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {movie.posterUrl && !imageError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            {movie.contentType === 'MOVIE' ? (
              <Film className="h-24 w-24 text-primary" />
            ) : (
              <Tv className="h-24 w-24 text-primary" />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="bg-black/50 hover:bg-black/70 text-white border-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              {movie.posterUrl && !imageError ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-auto"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  {movie.contentType === 'MOVIE' ? (
                    <Film className="h-24 w-24 text-primary" />
                  ) : (
                    <Tv className="h-24 w-24 text-primary" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {movie.year && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{movie.year}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{movie.duration}</span>
                  </div>
                )}
                {movie.rating && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4" />
                    <span>{movie.rating}</span>
                  </div>
                )}
                {movie.quality && (
                  <Badge className={`${getQualityColor(movie.quality)} text-white`}>
                    {movie.quality}
                  </Badge>
                )}
                <Badge variant="secondary">
                  {movie.contentType === 'MOVIE' ? 'Movie' : 'TV Show'}
                </Badge>
                {movie.category && (
                  <Badge variant="outline">
                    {movie.category.name}
                  </Badge>
                )}
              </div>
            </div>

            {movie.description && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={handleWatchNow}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 min-w-[200px]"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Now
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground hover:bg-accent"
              >
                <Heart className="h-5 w-5 mr-2" />
                Add to Watchlist
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground hover:bg-accent"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Related Content */}
        {relatedContent.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              More {movie.category?.name}
            </h2>
            <HorizontalScroll>
              {relatedContent.map((content) => (
                <MovieCard
                  key={content.id}
                  content={content}
                  onClick={() => {
                    window.location.href = `/movie/${content.id}`;
                  }}
                />
              ))}
            </HorizontalScroll>
          </section>
        )}
      </div>
    </div>
  );
}

export default function MovieDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <MovieDetailContent />
    </Suspense>
  );
}