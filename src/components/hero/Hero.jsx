import { motion, useReducedMotion } from 'framer-motion';
import MagneticButton from '../ui/MagneticButton.jsx';
import HeroBackground from './HeroBackground.jsx';
import { useTypewriter } from '../../hooks/useTypewriter.js';

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const role = useTypewriter([
    'Full Stack Developer',
    'React Frontend Engineer',
    'Node.js Backend Builder',
    'Problem Solver',
  ]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-700/40 bg-slate-950/70 p-6 shadow-soft backdrop-blur-xl sm:p-10">
      <HeroBackground />
      <div className="relative z-[1] flex flex-col gap-10 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <motion.p
            className="text-sm font-medium uppercase tracking-[0.25em] text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Building modern digital experiences
          </motion.p>

          <motion.h1
            className="font-heading text-3xl font-semibold text-slate-50 sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Habtamu Shewamene
            </span>
            <br />
            <span className="inline-flex min-h-8 items-center text-xl font-normal text-slate-300 sm:text-2xl">
              {role}
              <span className="ml-1 h-6 w-[2px] animate-pulse bg-primary/80" />
            </span>
          </motion.h1>

          <motion.p
            className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            I enjoy turning complex problems into simple, scalable solutions. I&apos;m focused on
            building real-world full stack applications using modern technologies and clean code
            practices.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <MagneticButton
              onClick={() => scrollTo('projects')}
              className="interactive inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
            >
              View Projects
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollTo('contact')}
              className="interactive inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900 px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-primary hover:text-primary"
            >
              Contact Me
            </MagneticButton>
          </motion.div>

          <motion.div
            className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Open to junior opportunities
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1">
              Full Stack - React - Node - Java
            </span>
          </motion.div>
        </div>

        <motion.div
          className="relative mt-4 flex flex-1 justify-center md:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <motion.div
            className="group relative h-56 w-56 overflow-hidden rounded-3xl border border-slate-600/70 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-soft sm:h-72 sm:w-72"
            whileHover={reducedMotion ? undefined : { scale: 1.04, rotate: -2, rotateY: 9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-secondary/50"
              whileHover={reducedMotion ? undefined : { scale: 1.12, rotate: 4 }}
              transition={{ duration: 0.5 }}
            />
            <div className="relative flex h-full flex-col items-center justify-center">
              <div className="mb-4 h-24 w-24 rounded-full border border-slate-700/70 bg-slate-900/80 ring-2 ring-primary/70" />
              <p className="font-heading text-base font-semibold text-slate-50">
                Habtamu Shewamene
              </p>
              <p className="text-xs text-slate-400">{role || 'Full Stack Developer'}</p>
            </div>
            <motion.div
              className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-sky-500/30 blur-2xl"
              animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </motion.div>

          <div className="pointer-events-none absolute -right-8 -top-6 h-24 w-24 rounded-3xl border border-sky-500/30 bg-sky-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
