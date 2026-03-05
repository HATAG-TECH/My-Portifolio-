import { motion, useReducedMotion } from 'framer-motion';
import { useTilt } from '../../hooks/useTilt.js';

export default function ProjectCard({ project, onOpen }) {
  const { title, description, techStack, github, demo } = project;
  const reducedMotion = useReducedMotion();
  const { tilt, onMouseMove, onMouseLeave } = useTilt(9);

  const handleClick = () => {
    if (onOpen) onOpen(project);
  };

  return (
    <motion.article
      className="glass-panel interactive group flex h-full cursor-pointer flex-col justify-between rounded-2xl p-5 outline-none transition-shadow hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary/70"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      <div>
        <motion.div
          className="theme-surface mb-4 overflow-hidden rounded-xl"
          whileHover={reducedMotion ? undefined : { rotate: -1.4 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="theme-text-muted flex h-28 items-center justify-center text-xl font-semibold tracking-wide"
            whileHover={reducedMotion ? undefined : { scale: 1.08, rotate: 1.1 }}
            transition={{ duration: 0.35 }}
          >
            {title.slice(0, 2).toUpperCase()}
          </motion.div>
        </motion.div>

        <h3 className="theme-text-primary font-heading text-base font-semibold sm:text-lg">{title}</h3>
        <p className="theme-text-muted mt-2 text-xs leading-relaxed sm:text-sm">{description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="theme-chip rounded-full px-2.5 py-1 text-[10px] font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2 text-xs font-medium">
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          className="theme-button-secondary interactive inline-flex flex-1 items-center justify-center rounded-full px-3 py-1.5 transition"
          onClick={(event) => event.stopPropagation()}
        >
          View GitHub
        </a>
        <a
          href={demo || '#'}
          target="_blank"
          rel="noreferrer"
          className="theme-button-primary interactive inline-flex flex-1 items-center justify-center rounded-full px-3 py-1.5 transition"
          onClick={(event) => event.stopPropagation()}
        >
          Live Demo
        </a>
      </div>
    </motion.article>
  );
}
