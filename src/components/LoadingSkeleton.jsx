import { motion } from 'framer-motion';

// very simple shimmer skeleton box
export default function LoadingSkeleton({ className = 'h-8 w-full rounded', style = {} }) {
  return (
    <motion.div
      className={`bg-slate-700/20 ${className} relative overflow-hidden`}
      style={style}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </motion.div>
  );
}
