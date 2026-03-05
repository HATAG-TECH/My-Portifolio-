import { useState, useEffect } from 'react';

// returns a value between 0 and 1 representing how far the page has been scrolled
export default function useScrollProgress({ debounceMs = 10 } = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(scrollTop / height, 1) : 0);
    };

    let timer = null;
    const debounced = () => {
      if (timer) return;
      timer = setTimeout(() => {
        handleScroll();
        timer = null;
      }, debounceMs);
    };

    window.addEventListener('scroll', debounced, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', debounced);
  }, [debounceMs]);

  return progress;
}
