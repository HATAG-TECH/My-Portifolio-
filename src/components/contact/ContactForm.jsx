import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { sendContactMessage } from '../../services/api.js';
import FloatingField from '../ui/FloatingField.jsx';
import MagneticButton from '../ui/MagneticButton.jsx';

const confettiPieces = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 0.25,
  duration: 0.7 + Math.random() * 0.5,
}));

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!form.message.trim()) errors.message = 'Message is required.';
  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });
  const [errors, setErrors] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    const validationErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: validationErrors[name] || '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setStatus({ loading: true, success: '', error: '' });
    try {
      await sendContactMessage(form);
      setStatus({
        loading: false,
        success: 'Thanks for reaching out! I will get back to you soon.',
        error: '',
      });
      setForm({ name: '', email: '', message: '' });
      setShowConfetti(true);
      window.setTimeout(() => setShowConfetti(false), 1300);
    } catch {
      setStatus({
        loading: false,
        success: '',
        error: 'Something went wrong sending your message. Please try again later.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-slate-50 sm:text-3xl">
          Let&apos;s <span className="text-primary">Connect</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          Whether you have a project in mind, feedback on my work, or just want to say hi, feel
          free to send a message.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel relative max-w-xl space-y-4 rounded-2xl p-5">
        {showConfetti && !reducedMotion && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            {confettiPieces.map((piece) => (
              <motion.span
                key={piece.id}
                className="absolute top-4 h-2 w-2 rounded-sm bg-gradient-to-r from-sky-400 to-violet-400"
                style={{ left: piece.left }}
                initial={{ opacity: 1, y: 0, rotate: 0 }}
                animate={{ opacity: 0, y: 130, rotate: 220 }}
                transition={{ duration: piece.duration, delay: piece.delay }}
              />
            ))}
          </div>
        )}

        <FloatingField
          id="name"
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={errors.name}
        />

        <FloatingField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={errors.email}
        />

        <FloatingField
          id="message"
          name="message"
          label="Message"
          as="textarea"
          rows={4}
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={errors.message}
        />

        <MagneticButton
          type="submit"
          disabled={status.loading}
          className="interactive inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status.loading ? 'Sending...' : 'Send Message'}
        </MagneticButton>

        {status.success && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-emerald-400 sm:text-sm"
          >
            {status.success}
          </motion.p>
        )}
        {status.error && <p className="text-xs text-red-400 sm:text-sm">{status.error}</p>}
      </form>
    </div>
  );
}
