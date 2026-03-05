import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import ProjectCard from './ProjectCard.jsx';
import ProjectModal from './ProjectModal.jsx';
import ShimmerSkeleton from '../ui/ShimmerSkeleton.jsx';
import { PROJECT_CATEGORIES, projects as staticProjects } from '../../data/projectsData.js';
import { fetchProjects } from '../../services/api.js';

export default function ProjectGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState(staticProjects);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    async function load() {
      try {
        const apiProjects = await fetchProjects();
        if (Array.isArray(apiProjects) && apiProjects.length > 0) {
          setProjects(apiProjects);
        } else {
          setProjects(staticProjects);
        }
      } catch {
        setProjects(staticProjects);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered =
    selectedCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-slate-50 sm:text-3xl">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-300">
            Real projects that show my progress as a developer, from data structures and desktop
            apps to full stack web applications.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PROJECT_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`interactive rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedCategory === category
                  ? 'bg-primary text-slate-950'
                  : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ShimmerSkeleton className="h-72" />
          <ShimmerSkeleton className="h-72" />
          <ShimmerSkeleton className="h-72" />
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          transition={{ layout: { duration: 0.25, type: 'spring' } }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: reducedMotion ? 0 : 0.35, delay: index * 0.05 }}
              >
                <ProjectCard project={project} onOpen={setSelectedProject} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
