import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down' | null;

export function useScrollDirection(threshold: number = 10): {
  scrollDirection: ScrollDirection;
  isAtTop: boolean;
} {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      // Only update if we've scrolled more than the threshold
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > threshold) {
        setScrollDirection(direction);
      }
      
      // Check if we're at the top
      setIsAtTop(scrollY < 10);
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };

    // Add event listener
    window.addEventListener('scroll', updateScrollDirection, { passive: true });

    // Initial check
    updateScrollDirection();

    // Cleanup
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection, lastScrollY, threshold]);

  return { scrollDirection, isAtTop };
}