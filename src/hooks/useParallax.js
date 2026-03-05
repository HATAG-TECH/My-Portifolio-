import { useScroll, useTransform } from 'framer-motion';

export function useParallax(distance = 100) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  return y;
}
