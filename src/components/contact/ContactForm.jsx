import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendContactMessage } from '../../services/api.js';

function extractApiError(error) {
  const payload = error?.response?.data;
  if (!payload) return 'Unable to reach server. Make sure backend is running.';
  if (Array.isArray(payload.errors) && payload.errors.length) return payload.errors[0];
  return payload.message || payload.error || 'Something went wrong. Please try again.';
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    consent: false,
    website: '',
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (status.error) setStatus((prev) => ({ ...prev, error: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ loading: false, success: false, error: 'Please fill in all fields.' });
      return;
    }
    if (!formData.consent) {
      setStatus({ loading: false, success: false, error: 'Please provide GDPR consent.' });
      return;
    }

    setStatus({ loading: true, success: false, error: '' });
    try {
      await sendContactMessage(formData);
      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', message: '', consent: false, website: '' });
      window.setTimeout(() => {
        setStatus({ loading: false, success: false, error: '' });
      }, 4500);
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: extractApiError(error),
      });
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="section-container max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="theme-text-primary mb-10 text-center font-heading text-4xl font-bold"
        >
          Get In Touch
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="theme-surface space-y-5 rounded-2xl p-6"
        >
          <div>
            <label className="theme-text-muted mb-2 block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="theme-input w-full rounded-lg border px-4 py-3 text-sm"
              placeholder="Your name"
              disabled={status.loading}
            />
          </div>

          <div>
            <label className="theme-text-muted mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="theme-input w-full rounded-lg border px-4 py-3 text-sm"
              placeholder="you@example.com"
              disabled={status.loading}
            />
          </div>

          <div>
            <label className="theme-text-muted mb-2 block text-sm font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="theme-input w-full resize-none rounded-lg border px-4 py-3 text-sm"
              placeholder="Tell me about your project..."
              disabled={status.loading}
            />
          </div>

          <label className="theme-text-muted flex items-start gap-2 text-xs">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-0.5"
              disabled={status.loading}
            />
            <span>I consent to processing my message and contact details for this request.</span>
          </label>

          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {status.error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400"
            >
              {status.error}
            </motion.div>
          )}

          {status.success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400"
            >
              Message sent successfully. I&apos;ll get back to you soon.
            </motion.div>
          )}

          <button
            type="submit"
            disabled={status.loading}
            className={`theme-button-primary w-full rounded-lg px-6 py-3 text-sm font-semibold ${
              status.loading ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            {status.loading ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
