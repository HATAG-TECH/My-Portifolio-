import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const interactiveSelector = 'a, button, [role="button"], input, textarea, select';

export default function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const [cursor, setCursor] = useState({ x: -100, y: -100, active: false });

  useEffect(() => {
    if (reducedMotion) return undefined;

    const onMove = (event) => {
      const target = event.target;
      const isInteractive = target instanceof Element && Boolean(target.closest(interactiveSelector));
      setCursor({
        x: event.clientX,
        y: event.clientY,
        active: isInteractive,
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <motion.div
        className="custom-cursor hidden md:block"
        animate={{
          x: cursor.x - 10,
          y: cursor.y - 10,
          scale: cursor.active ? 1.6 : 1,
        }}
        transition={{ type: 'spring', stiffness: 550, damping: 35, mass: 0.2 }}
      />
      <motion.div
        className="custom-cursor-ring hidden md:block"
        animate={{
          x: cursor.x - 24,
          y: cursor.y - 24,
          scale: cursor.active ? 1.2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 30 }}
      />
    </>
  );
}
