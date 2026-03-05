import { motion, useReducedMotion } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic.js';
import { useMouseGlow } from '../../hooks/useMouseGlow.js';

export default function MagneticButton({
  children,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const reducedMotion = useReducedMotion();
  const { position, onMouseMove, onMouseLeave } = useMagnetic(22);
  const { glowStyle, onMouseMove: onGlowMove, onMouseLeave: onGlowLeave } = useMouseGlow();

  return (
    <motion.button
      type={type}
      onClick={onClick}
      onMouseMove={(event) => {
        onMouseMove(event);
        onGlowMove(event);
      }}
      onMouseLeave={() => {
        onMouseLeave();
        onGlowLeave();
      }}
      animate={
        reducedMotion
          ? { x: 0, y: 0 }
          : {
              x: position.x,
              y: position.y,
            }
      }
      transition={{ type: 'spring', stiffness: 280, damping: 18, mass: 0.2 }}
      className={`relative overflow-hidden will-change-transform ${className}`}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-xl"
        animate={{
          opacity: glowStyle.opacity,
          left: glowStyle.x,
          top: glowStyle.y,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ width: 120, height: 120 }}
      />
      <span className="relative z-[1]">{children}</span>
    </motion.button>
  );
}
