import { useCallback, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useMagnetic(strength = 28) {
  const reducedMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (event) => {
      if (reducedMotion) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      setPosition({
        x: (x / (rect.width / 2)) * strength,
        y: (y / (rect.height / 2)) * strength,
      });
    },
    [reducedMotion, strength],
  );

  const onMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return { position, onMouseMove, onMouseLeave };
}
