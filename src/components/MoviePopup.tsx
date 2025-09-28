'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Calendar, Clock, Play, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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

interface MoviePopupProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MoviePopup({ content, isOpen, onClose }: MoviePopupProps) {
  if (!content) return null;

  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case 'HD': return 'bg-blue-500';
      case 'FULL_HD': return 'bg-green-500';
      case 'FOUR_K': return 'bg-purple-500';
      case 'EIGHT_K': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleWatchFullMovie = () => {
    if (content.telegramUrl) {
      window.open(content.telegramUrl, '_blank');
    }
  };

  const handleDownloadHD = () => {
    if (content.telegramUrl) {
      window.open(content.telegramUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Popup Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl w-full max-h-[95vh] overflow-hidden mx-2 sm:mx-4 md:mx-0 md:max-w-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 border border-white/20"
              >
                <X className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
              </button>

              {/* Content Layout */}
              <div className="flex flex-col md:flex-row h-full">
                {/* Left Side - Image */}
                <div className="md:w-2/5 relative">
                  <div className="relative h-40 sm:h-48 md:h-full min-h-[160px] sm:min-h-[192px] md:min-h-full">
                    {content.posterUrl ? (
                      <Image
                        src={content.posterUrl}
                        alt={content.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                        unoptimized={content.posterUrl.startsWith('http')}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                            <Play className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                          </div>
                          <p className="text-purple-300 text-xs sm:text-sm">No Image Available</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Image Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Quality Badge */}
                    {content.quality && (
                      <div className={`absolute top-1 sm:top-2 left-1 sm:left-2 md:top-4 md:left-4 ${getQualityColor(content.quality)} text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold shadow-lg`}>
                        {content.quality}
                      </div>
                    )}
                    
                    {/* Content Type Badge */}
                    <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 md:bottom-4 md:left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold border border-white/20">
                      {content.contentType === 'MOVIE' ? 'Movie' : 'Web Series'}
                    </div>
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="md:w-3/5 p-3 sm:p-4 md:p-8 flex flex-col h-full">
                  {/* Title Section */}
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight">
                      {content.title}
                    </h1>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
                      {content.year && (
                        <div className="flex items-center gap-1 text-gray-300">
                          <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                          <span className="text-xs sm:text-sm md:text-sm">{content.year}</span>
                        </div>
                      )}
                      {content.duration && (
                        <div className="flex items-center gap-1 text-gray-300">
                          <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                          <span className="text-xs sm:text-sm md:text-sm">{content.duration}</span>
                        </div>
                      )}
                      {content.rating && (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 fill-current" />
                          <span className="text-xs sm:text-sm md:text-sm font-medium">{content.rating}</span>
                        </div>
                      )}
                      {content.category && (
                        <div className="bg-purple-500/20 text-purple-300 text-xs px-1.5 sm:px-2 py-0.5 rounded-full border border-purple-500/30">
                          {content.category.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {content.description && (
                    <div className="mb-4 sm:mb-6 md:mb-8 flex-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2 md:mb-3">Overview</h3>
                      <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base line-clamp-3 sm:line-clamp-4 md:line-clamp-6">
                        {content.description}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 sm:space-y-3 mt-auto">
                    <Button
                      onClick={handleWatchFullMovie}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-6 rounded-lg md:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-purple-500/30 text-xs sm:text-sm md:text-base"
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                      Watch Full Movie
                    </Button>
                    
                    <Button
                      onClick={handleDownloadHD}
                      variant="outline"
                      className="w-full bg-transparent hover:bg-white/10 text-white font-semibold py-2 sm:py-3 px-3 sm:px-6 rounded-lg md:rounded-xl transition-all duration-200 border border-white/20 hover:border-white/40 shadow-lg text-xs sm:text-sm md:text-base"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                      Download HD
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bottom Gradient Border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}