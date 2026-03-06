import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme.js';
import {
  createAssistantMemory,
  createInitialAssistantMessage,
  generateAssistantReply,
  updateMemory,
} from '../../services/assistantEngine.js';
import ChatMessage from './ChatMessage.jsx';
import ChatInput from './ChatInput.jsx';
import TypingIndicator from './TypingIndicator.jsx';

const STORAGE_KEYS = {
  history: 'portfolio-chat-history-v3',
  open: 'portfolio-chat-open-v1',
  unread: 'portfolio-chat-unread-v1',
  welcomed: 'portfolio-chat-welcomed-v1',
};

const QUICK_ACTIONS = [
  { id: 'about', label: 'About Me', prompt: 'Tell me about Habtamu' },
  { id: 'projects', label: 'Projects', prompt: 'What projects has he built?' },
  { id: 'skills', label: 'Skills', prompt: 'What are his skills?' },
  { id: 'contact', label: 'Contact', prompt: 'How can I contact him?' },
];

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export default function ChatAssistant() {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(() => readStorage(STORAGE_KEYS.open, false));
  const [unreadCount, setUnreadCount] = useState(() => readStorage(STORAGE_KEYS.unread, 0));
  const [messages, setMessages] = useState(() => readStorage(STORAGE_KEYS.history, []));
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [helperText, setHelperText] = useState('');
  const memoryRef = useRef(createAssistantMemory());
  const scrollRef = useRef(null);
  const replyTimeoutRef = useRef(null);

  const showQuickActions = !draft.trim();

  useEffect(() => {
    writeStorage(STORAGE_KEYS.history, messages);
  }, [messages]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.open, isOpen);
  }, [isOpen]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.unread, unreadCount);
  }, [unreadCount]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => () => {
    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setUnreadCount(0);

    const hasWelcomed = readStorage(STORAGE_KEYS.welcomed, false);
    if (!hasWelcomed && messages.length === 0) {
      setMessages([createInitialAssistantMessage()]);
      writeStorage(STORAGE_KEYS.welcomed, true);
    }
  }, [isOpen, messages.length]);

  const sendMessage = (nextText) => {
    const trimmed = nextText.trim();
    if (!trimmed || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setIsTyping(true);
    setHelperText('');

    const delay = 1000 + Math.floor(Math.random() * 1000);

    replyTimeoutRef.current = window.setTimeout(() => {
      try {
        const reply = generateAssistantReply(trimmed, memoryRef.current);
        memoryRef.current = updateMemory(memoryRef.current, reply);

        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply.text,
          ts: Date.now(),
          intent: reply.intent,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);

        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-error-${Date.now()}`,
            role: 'assistant',
            content:
              'Sorry, I am having trouble right now. Please try again or use the contact form below.',
            ts: Date.now(),
            intent: 'error',
          },
        ]);
        setIsTyping(false);
        setHelperText("I couldn't process that response. Please try again.");
      }
    }, delay);
  };

  const handleQuickAction = (prompt) => {
    sendMessage(prompt);
  };

  const windowClass = isDark
    ? 'border-white/15 bg-slate-900/70 text-slate-100'
    : 'border-slate-200 bg-white/90 text-slate-800';

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-xl text-white shadow-lg shadow-blue-500/40 transition hover:scale-105"
          aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
        >
          <motion.span
            className="absolute inset-0 rounded-full border border-white/25"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>{isOpen ? 'X' : 'AI'}</span>
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className={`fixed z-40 border shadow-2xl backdrop-blur-xl ${windowClass} bottom-20 right-4 left-4 rounded-2xl sm:left-auto sm:w-[380px]`}
            role="dialog"
            aria-label="Portfolio AI assistant"
          >
            <header className={`flex items-center justify-between border-b px-3 py-2 ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
              <div>
                <h2 className="font-heading text-sm font-semibold">AI Assistant</h2>
                <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                  Ask about Habtamu's projects, skills, and contact details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`rounded-md px-2 py-1 text-xs ${isDark ? 'bg-slate-800/80 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                aria-label="Close chat"
              >
                Close
              </button>
            </header>

            <div
              ref={scrollRef}
              className="max-h-[52vh] space-y-2 overflow-y-auto px-3 py-3 sm:max-h-[420px]"
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} isDark={isDark} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>

            {helperText && (
              <p className="px-3 pb-1 text-[11px] text-amber-500">{helperText}</p>
            )}

            <ChatInput
              value={draft}
              onChange={setDraft}
              onSend={() => sendMessage(draft)}
              quickActions={QUICK_ACTIONS}
              showQuickActions={showQuickActions}
              onQuickAction={handleQuickAction}
              isDark={isDark}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

