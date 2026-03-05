import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

// A canvas-based background with a morphing gradient mesh and a simple particle network.
// This implementation is intentionally lightweight – the drawing logic can be expanded.
export default function AnimatedBackground() {
  const meshRef = useRef(null);
  const particlesRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // disable heavy animations if user prefers reduced motion

    const meshCanvas = meshRef.current;
    const partCanvas = particlesRef.current;
    if (!meshCanvas || !partCanvas) return;

    const resize = () => {
      meshCanvas.width = window.innerWidth;
      meshCanvas.height = window.innerHeight;
      partCanvas.width = window.innerWidth;
      partCanvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const meshCtx = meshCanvas.getContext('2d');
    const partCtx = partCanvas.getContext('2d');

    // simple gradient that fades between three colors over time
    let gradPhase = 0;
    const colors = ['#0a1929', '#3b82f6', '#8b5cf6'];

    let mouseX = partCanvas.width / 2;
    let mouseY = partCanvas.height / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      gradPhase += 0.002;
      const g = meshCtx.createLinearGradient(0, 0, meshCanvas.width, meshCanvas.height);
      const c1 = colors[Math.floor(gradPhase) % colors.length];
      const c2 = colors[(Math.floor(gradPhase) + 1) % colors.length];
      g.addColorStop(0, c1);
      g.addColorStop(1, c2);
      meshCtx.fillStyle = g;
      meshCtx.fillRect(0, 0, meshCanvas.width, meshCanvas.height);

      // simple particle network that shifts toward the mouse
      partCtx.clearRect(0, 0, partCanvas.width, partCanvas.height);
      const count = 80;
      for (let i = 0; i < count; i++) {
        const x = (Math.random() * partCanvas.width) | 0;
        const y = (Math.random() * partCanvas.height) | 0;
        const dx = (mouseX - x) * 0.0005;
        const dy = (mouseY - y) * 0.0005;
        partCtx.fillStyle = 'rgba(255,255,255,0.1)';
        partCtx.beginPath();
        partCtx.arc(x + dx * count, y + dy * count, 1.5, 0, Math.PI * 2);
        partCtx.fill();
      }

      requestAnimationFrame(draw);
    };

    draw();
    return () => window.removeEventListener('resize', resize);
  }, [reduced]);

  return (
    <>
      <canvas
        ref={meshRef}
        className="pointer-events-none fixed inset-0 -z-10" />
      <canvas
        ref={particlesRef}
        className="pointer-events-none fixed inset-0 -z-10" />
    </>
  );
}
