import { useEffect, useState } from 'react';

export function useDebouncedScroll(delay = 40) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let timeoutId;

    const onScroll = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setScrollY(window.scrollY || 0);
      }, delay);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', onScroll);
    };
  }, [delay]);

  return scrollY;
}
