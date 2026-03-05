import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme.js';
import { useDebouncedScroll } from '../../hooks/useDebouncedScroll.js';

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label="Toggle theme"
      className="interactive relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-100 text-slate-800 shadow-sm transition hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      whileTap={{ scale: 0.92 }}
    >
      <motion.span
        className="absolute h-5 w-5 rounded-full bg-amber-400"
        animate={
          theme === 'dark'
            ? { scale: 0.7, x: 2, y: -2 }
            : { scale: 1, x: 0, y: 0 }
        }
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="absolute h-5 w-5 rounded-full bg-slate-900"
        animate={
          theme === 'dark'
            ? { x: 4, y: -3, opacity: 1 }
            : { x: 14, y: -12, opacity: 0 }
        }
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const reducedMotion = useReducedMotion();
  useDebouncedScroll(40);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.25 });

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (inView[0]?.target?.id) {
          setActiveSection(inView[0].target.id);
        }
      },
      { threshold: [0.35, 0.5, 0.7], rootMargin: '-18% 0px -45% 0px' },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl transition-colors duration-500 dark:border-slate-800/60 dark:bg-slate-900/75">
      <motion.div
        className="absolute inset-x-0 top-0 h-[3px] origin-left bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500"
        style={{ scaleX: progress }}
      />

      <nav className="section-container flex h-16 items-center justify-between">
        <button
          type="button"
          className="interactive flex items-center gap-2"
          onClick={() => scrollToSection('home')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-secondary text-sm font-bold">
            HS
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-sm font-semibold tracking-wide">HATAG Tech</span>
            <span className="text-[11px] text-slate-400">Full Stack Developer</span>
          </div>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            {navLinks.map((link) => (
              <li key={link.id} className="relative">
                <button
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`interactive relative transition-colors hover:text-primary ${
                    activeSection === link.id ? 'text-primary' : ''
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute -bottom-1 left-0 h-[2px] w-full rounded bg-primary"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="interactive flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Toggle navigation menu"
          >
            {open ? 'X' : 'Menu'}
          </button>
        </div>
      </nav>

      <motion.div
        animate={{ opacity: reducedMotion ? 0 : 1 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
      />

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-200/70 bg-white/90 px-4 pb-4 pt-2 text-slate-800 shadow-lg md:hidden dark:border-slate-800/60 dark:bg-slate-950/95 dark:text-slate-100"
        >
          <ul className="space-y-1 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full rounded-md px-2 py-2 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
                    activeSection === link.id ? 'text-primary' : ''
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </header>
  );
}
