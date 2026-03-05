import { useState } from 'react';

export function useMouseGlow() {
  const [glowStyle, setGlowStyle] = useState({
    opacity: 0,
    x: 0,
    y: 0,
  });

  const onMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setGlowStyle({
      opacity: 1,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const onMouseLeave = () => {
    setGlowStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return { glowStyle, onMouseMove, onMouseLeave };
}
