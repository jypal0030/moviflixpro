'use client';

import { useEffect, useState } from 'react';
import { Play, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MovieCard from '@/components/MovieCard';
import HorizontalScroll from '@/components/HorizontalScroll';
import CategoryRow from '@/components/CategoryRow';
import MoviePopup from '@/components/MoviePopup';
import EnhancedSearch from '@/components/EnhancedSearch';
import DownloadButton from '@/components/DownloadButton';

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

export default function Home() {
  const [featuredContent, setFeaturedContent] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contentByCategory, setContentByCategory] = useState<Record<string, Content[]>>({});
  const [movies, setMovies] = useState<Content[]>([]);
  const [webSeries, setWebSeries] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'movies' | 'web-series'>('movies');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all data in parallel for better performance
      const [featuredResponse, moviesResponse, webSeriesResponse, categoriesResponse] = await Promise.all([
        fetch('/api/content/featured'),
        fetch('/api/content/movies'),
        fetch('/api/content/tv-shows'),
        fetch('/api/categories')
      ]);

      const [featuredData, moviesData, webSeriesData, categoriesData] = await Promise.all([
        featuredResponse.json(),
        moviesResponse.json(),
        webSeriesResponse.json(),
        categoriesResponse.json()
      ]);

      setFeaturedContent(featuredData);
      setMovies(moviesData);
      setWebSeries(webSeriesData);
      setCategories(categoriesData);

      // Fetch content for each category in parallel
      const categoryPromises = categoriesData.map(async (category: Category) => {
        const contentResponse = await fetch(`/api/content/category/${category.slug}`);
        const contentData = await contentResponse.json();
        return { categoryId: category.id, content: contentData };
      });

      const categoryResults = await Promise.all(categoryPromises);
      const contentByCategoryMap: Record<string, Content[]> = {};
      categoryResults.forEach(({ categoryId, content }) => {
        contentByCategoryMap[categoryId] = content;
      });
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

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedContent(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#bdc3c7 0%,#2c3e50 100%)' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/20 p-2 sm:p-4 shadow-lg" style={{ background: 'linear-gradient(135deg,#00b4db 0%,#0083b0 100%)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-sans tracking-wide">Movieflix Pro</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <EnhancedSearch />
            <DownloadButton />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.href = '/admin/login'}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 transition-all duration-200"
            >
              <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content Tabs */}
      <div className="pt-16 sm:pt-20 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="flex space-x-1 bg-white/20 backdrop-blur-sm p-1 rounded-xl w-64 sm:w-80 shadow-lg border border-white/30">
            <button
              onClick={() => setActiveTab('movies')}
              className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeTab === 'movies'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-white hover:text-blue-100 hover:bg-white/10'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveTab('web-series')}
              className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeTab === 'web-series'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-white hover:text-blue-100 hover:bg-white/10'
              }`}
            >
              Web Series
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-12">
        {activeTab === 'movies' && (
          <div className="space-y-1">
            {/* Featured Movies */}
            <section className="py-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans text-white mb-2 sm:mb-4 drop-shadow-lg tracking-wide">Featured Movies</h2>
              <HorizontalScroll>
                {movies.slice(0, 10).map((content) => (
                  <MovieCard
                    key={content.id}
                    content={content}
                    onClick={() => handleContentClick(content)}
                  />
                ))}
              </HorizontalScroll>
            </section>

            {/* Categories */}
            {categories.filter(cat => cat.contentType === 'MOVIE').map((category) => (
              <section key={category.id} className="py-1">
                <CategoryRow
                  category={category}
                  contents={contentByCategory[category.id] || []}
                  onMovieClick={handleContentClick}
                />
              </section>
            ))}
          </div>
        )}

        {activeTab === 'web-series' && (
          <div className="space-y-1">
            {/* Featured Web Series */}
            <section className="py-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans text-white mb-2 sm:mb-4 drop-shadow-lg tracking-wide">Featured Web Series</h2>
              <HorizontalScroll>
                {webSeries.slice(0, 10).map((content) => (
                  <MovieCard
                    key={content.id}
                    content={content}
                    onClick={() => handleContentClick(content)}
                  />
                ))}
              </HorizontalScroll>
            </section>

            {/* Web Series Categories */}
            {categories.filter(cat => cat.contentType === 'WEB_SERIES').map((category) => (
              <section key={category.id} className="py-1">
                <CategoryRow
                  category={category}
                  contents={contentByCategory[category.id] || []}
                  onMovieClick={handleContentClick}
                />
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Movie Popup */}
      <MoviePopup
        content={selectedContent}
        isOpen={isPopupOpen}
        onClose={closePopup}
      />

      {/* Professional Footer */}
      <footer className="backdrop-blur-md border-t border-white/20 mt-12 sm:mt-20" style={{ background: 'linear-gradient(135deg,#00b4db 0%,#0083b0 100%)' }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Brand Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans text-white tracking-wide">Movieflix Pro</h3>
              <p className="text-gray-100 leading-relaxed text-sm sm:text-base">
                Your ultimate streaming destination for premium movies and web series. 
                Experience entertainment like never before.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <a href="#" className="text-gray-100 hover:text-white transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-100 hover:text-white transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-100 hover:text-white transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-100 hover:text-white transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Browse Section */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-lg sm:text-xl font-sans text-white tracking-wide">Browse</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Movies</a></li>
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Web Series</a></li>
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">New Releases</a></li>
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Trending Now</a></li>
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Top Rated</a></li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-lg sm:text-xl font-sans text-white tracking-wide">Support</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Help Center</a></li>
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Contact Us</a></li>
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Terms of Service</a></li>
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Account Section */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-lg sm:text-xl font-sans text-white tracking-wide">Account</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">My Profile</a></li>
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Watchlist</a></li>
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Settings</a></li>
                <li><a href="/admin/login" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Admin Panel</a></li>
                <li><a href="#" className="text-gray-100 hover:text-white transition-colors text-sm sm:text-base">Sign Out</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/20 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-gray-100 text-xs sm:text-sm text-center sm:text-left">
                © 2024 Movieflix Pro. All rights reserved.
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-center sm:text-left">
                <a href="#" className="text-gray-100 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-100 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-100 hover:text-white transition-colors">Cookie Settings</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}