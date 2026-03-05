import { motion } from 'framer-motion';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 40, scale: 0.95 },
};

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 px-3 py-4 backdrop-blur-md sm:items-center sm:px-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="glass-panel relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-700/70 bg-slate-950/90 p-5 text-sm text-slate-100 shadow-2xl"
        variants={modalVariants}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} details`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-800/80 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
        >
          Close
        </button>

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Case Study
          </p>
          <h3 className="font-heading text-xl font-semibold text-slate-50">
            {project.title}
          </h3>
          <p className="mt-2 text-xs text-slate-300 sm:text-sm">
            {project.description}
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {project.techStack?.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-medium text-slate-100"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wide text-slate-400">
              Key Features
            </h4>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-200 sm:text-sm">
              {(project.features || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wide text-slate-400">
              Challenges Solved
            </h4>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-200 sm:text-sm">
              {(project.challenges || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-slate-900/90 px-4 py-2 text-slate-100 hover:bg-slate-800"
          >
            View GitHub
          </a>
          <a
            href={project.demo || '#'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-slate-950 hover:bg-sky-400"
          >
            Live Demo
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

