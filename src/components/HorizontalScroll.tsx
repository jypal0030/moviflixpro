'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export default function HorizontalScroll({ children, className = '' }: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Check scroll position
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Handle drag/swipe gestures
  const handleDragEnd = (event: any, { offset, velocity }: PanInfo) => {
    setIsDragging(false);
    const swipeThreshold = 50;
    const swipePower = Math.abs(offset.x) * velocity.x;

    if (swipePower > swipeThreshold) {
      if (offset.x > 0) {
        // Swiped right
        scroll('right');
      } else {
        // Swiped left
        scroll('left');
      }
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Scroll function
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Mouse wheel horizontal scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollRef.current && !isDragging) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY;
      }
    };

    const element = scrollRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
      return () => element.removeEventListener('wheel', handleWheel);
    }
  }, [isDragging]);

  // Check scroll position on mount and resize
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Scroll indicators */}
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full shadow-lg transition-all duration-200"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      
      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full shadow-lg transition-all duration-200"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}

      {/* Horizontal scroll container */}
      <motion.div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-4 py-4 cursor-grab active:cursor-grabbing"
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onScroll={checkScroll}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {children}
      </motion.div>
    </div>
  );
}