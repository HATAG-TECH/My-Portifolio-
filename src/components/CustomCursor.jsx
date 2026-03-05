import { useEffect, useRef } from 'react';

// a simple custom cursor that replaces the native pointer when hovering interactive elements
export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px,0)`;
    };

    const enlarge = () => cursor.classList.add('cursor--active');
    const shrink = () => cursor.classList.remove('cursor--active');

    document.addEventListener('mousemove', move);
    document.querySelectorAll('a, button, .magnetic').forEach((el) => {
      el.addEventListener('mouseenter', enlarge);
      el.addEventListener('mouseleave', shrink);
    });

    return () => {
      document.removeEventListener('mousemove', move);
      document.querySelectorAll('a, button, .magnetic').forEach((el) => {
        el.removeEventListener('mouseenter', enlarge);
        el.removeEventListener('mouseleave', shrink);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary opacity-75 transition-transform duration-150"
    />
  );
}
