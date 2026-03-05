import { motion } from 'framer-motion';

function metricValue(project, key) {
  return project?.metrics?.find((metric) => metric.label === key)?.value ?? 0;
}

export default function ProjectComparePanel({ projects, onRemove, onClear }) {
  if (!projects.length) return null;
  const [left, right] = projects;
  const metricKeys = ['Lighthouse Perf', 'API Success Rate', 'Endpoint Throughput'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="theme-surface rounded-2xl p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="theme-text-primary text-sm font-semibold">Project Comparison</h3>
        <button type="button" className="theme-button-secondary rounded-full px-3 py-1 text-xs" onClick={onClear}>
          Clear
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="theme-chip rounded-xl p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="theme-text-primary text-xs font-semibold">{project.title}</p>
              <button
                type="button"
                className="theme-button-secondary rounded-full px-2 py-0.5 text-[11px]"
                onClick={() => onRemove(project.id)}
              >
                Remove
              </button>
            </div>
            <p className="theme-text-soft text-[11px]">Complexity: {project.complexity}/5</p>
            <p className="theme-text-soft text-[11px]">Difficulty: {project.difficulty}/5</p>
            <p className="theme-text-soft text-[11px]">Tech: {project.techStack.join(', ')}</p>
          </div>
        ))}
      </div>

      {left && right && (
        <div className="mt-3 grid gap-2">
          {metricKeys.map((key) => (
            <div key={key} className="theme-chip flex items-center justify-between rounded-lg px-3 py-2 text-xs">
              <span>{key}</span>
              <span>
                {metricValue(left, key)} vs {metricValue(right, key)}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
