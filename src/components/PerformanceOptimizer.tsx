'use client';

import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export default function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  useEffect(() => {
    // Preload critical resources
    if (typeof window !== 'undefined') {
      // Preconnect to external domains
      const preconnectLinks = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://images.unsplash.com'
      ];

      preconnectLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        document.head.appendChild(link);
      });

      // Lazy load non-critical images
      const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.dataset.src || '';
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      };

      // Defer non-critical JavaScript
      const deferScripts = () => {
        const scripts = document.querySelectorAll('script[defer]');
        scripts.forEach(script => {
          script.setAttribute('defer', 'defer');
        });
      };

      // Initialize optimizations
      if (document.readyState === 'complete') {
        lazyLoadImages();
        deferScripts();
      } else {
        window.addEventListener('load', () => {
          lazyLoadImages();
          deferScripts();
        });
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', () => {});
    };
  }, []);

  return <>{children}</>;
}