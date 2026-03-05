import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../hooks/useChat.js';

const quickActions = [
  { id: 'projects', label: 'Show projects', prompt: 'Show me Habtamu’s projects.' },
  { id: 'skills', label: 'Skills', prompt: 'What are Habtamu’s main skills?' },
  { id: 'experience', label: 'Experience', prompt: "Tell me about Habtamu's experience." },
  { id: 'contact', label: 'Contact', prompt: 'How can I contact Habtamu?' },
];

export default function ChatBot() {
  const { isOpen, toggleOpen, messages, isTyping, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const [helper, setHelper] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = sendMessage(input);
    if (!result.accepted) {
      if (result.reason === 'rate_limited') {
        setHelper('Taking a short pause so the conversation stays readable ✨');
      }
      return;
    }
    setInput('');
    setHelper('');
  };

  const handleQuickAction = (prompt) => {
    setInput('');
    sendMessage(prompt);
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleOpen}
        className="hatag-pulse fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-xl text-white shadow-lg shadow-blue-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:ring-offset-slate-900"
        aria-label="Open AI assistant chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed inset-x-0 bottom-0 z-40 mx-auto mb-3 w-full max-w-md rounded-t-3xl border border-white/20 bg-slate-900/70 p-3 text-xs text-slate-100 shadow-2xl backdrop-blur-xl sm:bottom-20 sm:right-5 sm:mb-0 sm:ml-0 sm:max-w-sm sm:rounded-2xl sm:border-slate-700 sm:bg-slate-950/80"
            role="dialog"
            aria-label="Habtamu's AI assistant"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <p className="font-heading text-xs font-semibold">
                  HataG · Portfolio Assistant
                </p>
                <p className="text-[11px] text-slate-400">
                  Ask about projects, skills, or how Habtamu works 💻
                </p>
              </div>
              <button
                type="button"
                onClick={toggleOpen}
                className="rounded-full bg-slate-800/80 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mb-2 flex flex-wrap gap-1.5">
              {quickActions.map((qa) => (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => handleQuickAction(qa.prompt)}
                  className="rounded-full bg-slate-800/60 px-2 py-1 text-[11px] text-slate-100 hover:bg-slate-700/80"
                >
                  {qa.label}
                </button>
              ))}
            </div>

            <div
              ref={scrollRef}
              className="mb-2 max-h-60 space-y-1.5 overflow-y-auto pr-1"
            >
              {messages.map((msg, index) => (
                <div
                  key={`${msg.from}-${index}-${msg.ts || index}`}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white'
                        : 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-slate-50'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="mt-1 flex justify-start">
                  <div className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1.5">
                    <span className="hatag-typing-dot h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span className="hatag-typing-dot h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span className="hatag-typing-dot h-1.5 w-1.5 rounded-full bg-slate-300" />
                  </div>
                </div>
              )}
            </div>

            {helper && (
              <p className="mb-1 text-[10px] text-slate-400">{helper}</p>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-1.5 pt-1">
              <textarea
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask anything about Habtamu’s work…"
                className="max-h-20 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-[11px] text-slate-100 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                aria-label="Message to Habtamu's assistant"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md hover:from-blue-400 hover:to-purple-500 disabled:opacity-60"
                disabled={!input.trim()}
              >
                Send
              </button>
            </form>

            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
              <span>Knows Habtamu’s skills, projects & journey.</span>
              <span>AI demo · expandable to real API</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

