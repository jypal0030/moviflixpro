'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Category {
  id: string;
  name: string;
  slug: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
}

interface EnhancedSearchProps {
  onSearch?: (query: string, category?: string, contentType?: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export default function EnhancedSearch({ onSearch, isOpen = false, onClose, className = '' }: EnhancedSearchProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(isOpen);
  const [isCategoryListOpen, setIsCategoryListOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<'MOVIE' | 'WEB_SERIES' | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSearchOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter categories based on selected content type
    if (selectedContentType) {
      const filtered = categories.filter(cat => cat.contentType === selectedContentType);
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [selectedContentType, categories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Show category list when user starts typing
    if (value.trim() && !isCategoryListOpen) {
      setIsCategoryListOpen(true);
    }
  };

  const handleSearchInputFocus = () => {
    if (searchQuery.trim()) {
      setIsCategoryListOpen(true);
    }
  };

  const handleContentTypeSelect = (contentType: 'MOVIE' | 'WEB_SERIES') => {
    setSelectedContentType(contentType);
    setSelectedCategory(null); // Reset category when content type changes
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setIsCategoryListOpen(false);
    
    // Perform search after category selection
    performSearch(category);
  };

  const performSearch = (category?: Category) => {
    if (!searchQuery.trim()) return;

    const searchParams = new URLSearchParams({
      q: searchQuery.trim(),
    });

    if (category) {
      searchParams.append('category', category.slug);
      searchParams.append('type', category.contentType);
    } else if (selectedContentType) {
      searchParams.append('type', selectedContentType);
    }

    // Navigate to search page with parameters
    window.location.href = `/search?${searchParams.toString()}`;
    
    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(searchQuery.trim(), category?.slug, category?.contentType || selectedContentType || undefined);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If no category is selected but we have a query, search without category filter
    if (searchQuery.trim()) {
      performSearch(selectedCategory || undefined);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setIsCategoryListOpen(false);
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedContentType(null);
    if (onClose) {
      onClose();
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if (!isCategoryListOpen) {
          closeSearch();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryListOpen]);

  if (!isSearchOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSearchClick}
        className={`text-gray-300 hover:text-white transition-colors ${className}`}
      >
        <Search className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={closeSearch}>
      <div 
        ref={searchContainerRef}
        className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 w-full max-w-xl sm:max-w-2xl px-2 sm:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="bg-white rounded-lg shadow-2xl p-3 sm:p-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={handleSearchInputFocus}
              placeholder="Search movies by title..."
              className="pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-base sm:text-lg border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={closeSearch}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </form>
        </div>

        {/* Category List */}
        {isCategoryListOpen && (
          <div className="mt-2 bg-white rounded-lg shadow-2xl max-h-96 overflow-hidden">
            {/* Content Type Selection */}
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Select Content Type</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selectedContentType === 'MOVIE' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleContentTypeSelect('MOVIE')}
                  className={selectedContentType === 'MOVIE' ? 'bg-blue-600 text-white' : 'border-gray-300 text-gray-700 text-xs sm:text-sm'}
                >
                  Movies
                </Button>
                <Button
                  type="button"
                  variant={selectedContentType === 'WEB_SERIES' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleContentTypeSelect('WEB_SERIES')}
                  className={selectedContentType === 'WEB_SERIES' ? 'bg-blue-600 text-white' : 'border-gray-300 text-gray-700 text-xs sm:text-sm'}
                >
                  Web Series
                </Button>
              </div>
            </div>

            {/* Categories Grid */}
            {selectedContentType && (
              <div className="p-3 sm:p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Select Category ({selectedContentType === 'MOVIE' ? 'Movies' : 'Web Series'})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {filteredCategories.map((category) => (
                    <Button
                      key={category.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCategorySelect(category)}
                      className="border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-left justify-start text-xs sm:text-sm"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
                
                {filteredCategories.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No categories found for {selectedContentType === 'MOVIE' ? 'Movies' : 'Web Series'}
                  </p>
                )}
              </div>
            )}

            {/* Quick Search Option */}
            {selectedContentType && (
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => performSearch()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                  disabled={!searchQuery.trim()}
                >
                  <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Search All {selectedContentType === 'MOVIE' ? 'Movies' : 'Web Series'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Bottom indicator for category list */}
        {isCategoryListOpen && (
          <div className="flex justify-center mt-2">
            <div className="bg-white rounded-full p-1.5 sm:p-2 shadow-lg">
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}