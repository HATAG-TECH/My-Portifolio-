import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { downloadResume } from '../../services/resume.js';

function DownloadIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}

export default function ResumeDownloadButton({
  label = 'Download Resume',
  className = '',
  compact = false,
  pulseOnLoad = true,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleDownload = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await downloadResume();
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClass = compact
    ? 'px-3 py-2 text-xs'
    : 'px-5 py-2.5 text-sm';

  return (
    <motion.button
      type="button"
      onClick={handleDownload}
      disabled={isLoading}
      initial={reducedMotion || !pulseOnLoad ? false : { scale: 0.98, opacity: 0.9 }}
      animate={
        reducedMotion || !pulseOnLoad
          ? {}
          : {
              scale: [1, 1.02, 1],
              boxShadow: [
                '0 0 0 rgba(59,130,246,0.0)',
                '0 0 26px rgba(99,102,241,0.34)',
                '0 0 0 rgba(59,130,246,0.0)',
              ],
            }
      }
      transition={reducedMotion ? {} : { duration: 1.6, repeat: 1, ease: 'easeOut' }}
      whileHover={reducedMotion ? {} : { scale: 1.05 }}
      className={`resume-download-btn inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${sizeClass} ${className}`}
      aria-label={label}
    >
      {isLoading ? (
        <>
          <span className="resume-download-spinner h-4 w-4 rounded-full border-2 border-white/30 border-t-white" />
          <span>Preparing...</span>
        </>
      ) : (
        <>
          <DownloadIcon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
          <span>{label}</span>
        </>
      )}
    </motion.button>
  );
}
