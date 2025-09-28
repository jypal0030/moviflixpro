'use client';

import { useState } from 'react';
import { Play, Star, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
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

interface MovieCardProps {
  content: Content;
  onClick: () => void;
}

export default function MovieCard({ content, onClick }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const getImageSrc = () => {
    if (!content.posterUrl || imageError) {
      return '/placeholder-movie.jpg';
    }
    return content.posterUrl;
  };

  const handleCardClick = () => {
    // Call the onClick prop passed from parent
    onClick();
  };

  return (
    <motion.div
      className="flex-shrink-0 relative group cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Movie Poster */}
      <div className="relative w-48 h-72 md:w-56 md:h-84 overflow-hidden rounded-lg shadow-lg">
        <Image
          src={getImageSrc()}
          alt={content.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 192px, 224px"
          onError={() => setImageError(true)}
          unoptimized={content.posterUrl?.startsWith('http')}
        />
        
        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/80 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
            {content.title}
          </h3>
          
          {/* Movie Info */}
          <div className="flex items-center gap-3 text-sm text-gray-300 mb-3">
            {content.year && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{content.year}</span>
              </div>
            )}
            {content.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{content.duration}</span>
              </div>
            )}
            {content.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{content.rating}</span>
              </div>
            )}
          </div>
          
          {/* Description */}
          {content.description && (
            <p className="text-gray-300 text-sm mb-3 line-clamp-3">
              {content.description}
            </p>
          )}
          
          {/* Watch Button */}
          <motion.button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="h-4 w-4" />
            Watch Now
          </motion.button>
        </motion.div>
        
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
      
      {/* Movie Title (always visible) */}
      <div className="mt-2 px-1">
        <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {content.title}
        </h4>
        {content.category && (
          <p className="text-gray-400 text-xs mt-1">
            {content.category.name}
          </p>
        )}
      </div>
    </motion.div>
  );
}