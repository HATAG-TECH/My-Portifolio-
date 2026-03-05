import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useTilt(maxTilt = 8) {
  const reducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const onMouseMove = (event) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) * 2 - 1) * maxTilt;
    const rotateX = -(((y / rect.height) * 2 - 1) * maxTilt);
    setTilt({ rotateX, rotateY });
  };

  const onMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return { tilt, onMouseMove, onMouseLeave };
}
