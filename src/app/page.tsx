"use client";

import { useState, useEffect } from "react";
import { Search, Play, Star, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Content {
  id: string;
  title: string;
  description?: string;
  posterUrl?: string;
  year?: number;
  duration?: string;
  rating?: number;
  quality?: 'HD' | 'FULL_HD' | 'FOUR_K' | 'EIGHT_K';
  telegramUrl?: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
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
  contentCount: number;
}

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Content | null>(null);
  const [movies, setMovies] = useState<Record<string, Content[]>>({});
  const [webSeries, setWebSeries] = useState<Record<string, Content[]>>({});
  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [allContent, setAllContent] = useState<Content[]>([]);

  // Background gradients for cards
  const cardBackgrounds = [
    'linear-gradient(90deg,#1a2980,#26d0ce)',
    'radial-gradient(circle,#36d1dc,#5b86e5)',
    'linear-gradient(120deg,#cc2b5e,#753a88)',
    'linear-gradient(120deg,#2af598,#009efd)',
    'linear-gradient(120deg,#00c6ff,#0072ff)'
  ];

  const getRandomBackground = () => {
    return cardBackgrounds[Math.floor(Math.random() * cardBackgrounds.length)];
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      performSearch(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const performSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = allContent.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase()) ||
      item.description?.toLowerCase().includes(term.toLowerCase()) ||
      item.category?.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const movieCategoriesRes = await fetch('/api/categories?type=MOVIE');
      const movieCategories = await movieCategoriesRes.json();
      
      const webSeriesCategoriesRes = await fetch('/api/categories?type=WEB_SERIES');
      const webSeriesCategories = await webSeriesCategoriesRes.json();

      setCategories({
        movies: movieCategories,
        webSeries: webSeriesCategories,
      });

      // Fetch content for each category
      const moviesData: Record<string, Content[]> = {};
      const webSeriesData: Record<string, Content[]> = {};
      const allContentArray: Content[] = [];

      for (const category of movieCategories) {
        const contentRes = await fetch(`/api/content?type=MOVIE&category=${category.id}`);
        const content = await contentRes.json();
        moviesData[category.name] = content;
        allContentArray.push(...content);
      }

      for (const category of webSeriesCategories) {
        const contentRes = await fetch(`/api/content?type=WEB_SERIES&category=${category.id}`);
        const content = await contentRes.json();
        webSeriesData[category.name] = content;
        allContentArray.push(...content);
      }

      setMovies(moviesData);
      setWebSeries(webSeriesData);
      setAllContent(allContentArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (item: Content) => {
    setSelectedItem(item);
  };

  const handleWatchClick = () => {
    if (selectedItem?.telegramUrl) {
      window.open(selectedItem.telegramUrl, "_blank");
    } else {
      window.open("https://t.me/yourchannel", "_blank");
    }
  };

  const ContentRow = ({ title, items }: { title: string; items: Content[] }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item) => (
          <Card
            key={item.id}
            className="flex-shrink-0 w-[195px] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 border border-gray-600"
            style={{ background: 'linear-gradient(120deg,#cc2b5e,#753a88)' }}
            onClick={() => handleCardClick(item)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={item.posterUrl || "/api/placeholder/195/256"}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                  style={{ width: '195px', height: '256px' }}
                />
                <Badge className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700">
                  {item.quality === 'FOUR_K' ? '4K' : item.quality === 'FULL_HD' ? 'HD' : item.quality}
                </Badge>
              </div>
              <div className="p-1.5 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white truncate leading-tight flex-1">{item.title}</h3>
                  <span className="text-xs text-white ml-2">{item.year}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-1">
                    <Clock className="w-2 h-2 text-white" />
                    <span className="text-xs">{item.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-2 h-2 text-yellow-400 fill-current" />
                    <span className="text-xs text-yellow-400">{item.rating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(circle,#eef2f3,#8e9eab)' }}>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-sm border-b border-gray-800" style={{ background: 'linear-gradient(to right,#2980b9,#6dd5fa,#ffffff)' }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              MoviFlixPro
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = "/admin-login"}
              className="text-gray-800 hover:text-black hover:bg-purple-600/20 transition-all duration-300"
            >
              Admin
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-gray-800 hover:text-black hover:bg-purple-600/20 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="movies" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/50">
              <TabsTrigger 
                value="movies" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-gradient-to-r data-[state=inactive]:from-gray-700/50 data-[state=inactive]:to-gray-800/50 data-[state=inactive]:border-2 data-[state=inactive]:border-gray-600 data-[state=inactive]:text-gray-300 hover:bg-gray-700/70 transition-all duration-300"
              >
                Movies
              </TabsTrigger>
              <TabsTrigger 
                value="web-series" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-gradient-to-r data-[state=inactive]:from-gray-700/50 data-[state=inactive]:to-gray-800/50 data-[state=inactive]:border-2 data-[state=inactive]:border-gray-600 data-[state=inactive]:text-gray-300 hover:bg-gray-700/70 transition-all duration-300"
              >
                Web Series
              </TabsTrigger>
            </TabsList>

            <TabsContent value="movies" className="space-y-8">
              {Object.entries(movies).map(([categoryName, items]) => (
                <ContentRow key={categoryName} title={categoryName} items={items} />
              ))}
            </TabsContent>

            <TabsContent value="web-series" className="space-y-8">
              {Object.entries(webSeries).map(([categoryName, items]) => (
                <ContentRow key={categoryName} title={categoryName} items={items} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-black" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  MoviFlixPro
                </h2>
              </div>
              <p className="text-gray-300 mb-4">
                Your ultimate destination for movies and web series. Stream the latest content in high quality with an extensive library of entertainment.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm">ig</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Movies</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Web Series</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Categories</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">New Releases</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 MoviFlixPro. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="flex items-start justify-center pt-20">
            <div className="w-full max-w-4xl px-4">
              {/* Search Header with Close Button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Search Content</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchTerm("");
                    setSearchResults([]);
                  }}
                  className="border-gray-600 text-black font-bold hover:bg-gray-800 hover:text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
              
              <div className="relative mb-6">
                <Input
                  placeholder="Search movies and web series..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-12"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchTerm("");
                    setSearchResults([]);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Search Results */}
              {searchTerm && (
                <div className="bg-gray-900 rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-4">
                        Search Results ({searchResults.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {searchResults.map((item) => (
                          <div
                            key={item.id}
                            className="cursor-pointer transition-all duration-300 hover:scale-105"
                            onClick={() => {
                              handleCardClick(item);
                              setSearchOpen(false);
                              setSearchTerm("");
                              setSearchResults([]);
                            }}
                          >
                            <div className="rounded-lg border border-gray-600 p-2" style={{ background: 'linear-gradient(120deg,#cc2b5e,#753a88)' }}>
                              <div className="relative">
                                <img
                                  src={item.posterUrl || "/api/placeholder/195/256"}
                                  alt={item.title}
                                  className="w-full h-32 object-cover rounded-lg border border-gray-600"
                                  style={{ width: '100%', height: '128px' }}
                                />
                                <Badge className="absolute top-1 right-1 bg-purple-600 text-xs">
                                  {item.quality === 'FOUR_K' ? '4K' : item.quality === 'FULL_HD' ? 'HD' : item.quality}
                                </Badge>
                              </div>
                              <div className="mt-2">
                                <h4 className="text-white text-sm font-medium truncate">
                                  {item.title}
                                </h4>
                                <p className="text-white text-xs">
                                  {item.year} • {item.contentType === 'MOVIE' ? 'Movie' : 'Series'}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-yellow-400">{item.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">
                        {searchTerm.length > 0 
                          ? `No results found for "${searchTerm}"`
                          : "Start typing to search..."
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Quick filters (only show when not searching) */}
              {!searchTerm && (
                <div className="mt-4 space-y-2">
                  <p className="text-gray-400 text-sm">Quick filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.movies?.map((category) => (
                      <Badge 
                        key={category.id} 
                        variant="outline" 
                        className="border-gray-600 text-gray-300 hover:bg-purple-600 hover:text-white cursor-pointer"
                        onClick={() => setSearchTerm(category.name)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                    {categories.webSeries?.map((category) => (
                      <Badge 
                        key={category.id} 
                        variant="outline" 
                        className="border-gray-600 text-gray-300 hover:bg-purple-600 hover:text-white cursor-pointer"
                        onClick={() => setSearchTerm(category.name)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="border-gray-600 text-gray-300 hover:bg-purple-600 hover:text-white cursor-pointer"
                      onClick={() => setSearchTerm("2024")}>
                      2024
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-300 hover:bg-purple-600 hover:text-white cursor-pointer"
                      onClick={() => setSearchTerm("4K")}>
                      4K
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Movie/Series Details Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={selectedItem.posterUrl || "/api/placeholder/300/400"}
                  alt={selectedItem.title}
                  className="w-32 h-44 object-cover rounded-lg"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-4 text-sm">
                    <span>{selectedItem.year}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedItem.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400">{selectedItem.rating}</span>
                    </div>
                  </div>
                  <Badge className="bg-purple-600">
                    {selectedItem.quality === 'FOUR_K' ? '4K' : selectedItem.quality === 'FULL_HD' ? 'HD' : selectedItem.quality}
                  </Badge>
                  {selectedItem.description && (
                    <p className="text-gray-300 text-sm">
                      {selectedItem.description}
                    </p>
                  )}
                  <p className="text-gray-300 text-sm">
                    Experience this amazing {selectedItem.duration?.includes('Season') ? 'series' : 'movie'} in stunning {selectedItem.quality} quality. 
                    Click below to watch now on our Telegram channel.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleWatchClick}
                  className="bg-purple-600 hover:bg-purple-700 flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleWatchClick}
                  className="border-gray-600 text-white hover:bg-gray-800 flex-1"
                >
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}