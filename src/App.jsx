import { Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar.jsx';
import Hero from './components/hero/Hero.jsx';
import About from './components/about/About.jsx';
import ProjectGrid from './components/projects/ProjectGrid.jsx';
import Skills from './components/skills/Skills.jsx';
import Timeline from './components/experience/Timeline.jsx';
import ContactForm from './components/contact/ContactForm.jsx';
import ChatBot from './components/ai/ChatBot.jsx';
import Footer from './components/footer/Footer.jsx';
import { motion } from 'framer-motion';

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-light to-slate-100 text-slate-900 transition-colors duration-500 dark:bg-gradient-to-b dark:from-slate-950 dark:via-dark dark:to-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl dark:bg-primary/30" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-secondary/15 blur-3xl dark:bg-secondary/25" />

      <Navbar />
      <main className="relative pt-20 space-y-0">
        <section id="home" className="section-padding">
          <div className="section-container">
            <Hero />
          </div>
        </section>

        <motion.section
          id="about"
          className="section-padding bg-slate-900/40"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-container">
            <About />
          </div>
        </motion.section>

        <motion.section
          id="projects"
          className="section-padding"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <div className="section-container">
            <ProjectGrid />
          </div>
        </motion.section>

        <motion.section
          id="skills"
          className="section-padding bg-slate-900/40"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="section-container">
            <Skills />
          </div>
        </motion.section>

        <motion.section
          id="experience"
          className="section-padding"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="section-container">
            <Timeline />
          </div>
        </motion.section>

        <motion.section
          id="contact"
          className="section-padding bg-slate-900/40"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="section-container">
            <ContactForm />
          </div>
        </motion.section>
      </main>

      <ChatBot />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

