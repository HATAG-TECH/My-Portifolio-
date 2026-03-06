import { memo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import QuickActions from './QuickActions.jsx';

function ChatInput({
  value,
  onChange,
  onSend,
  quickActions,
  showQuickActions,
  onQuickAction,
  isDark,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSend();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`border-t px-3 py-2 ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
      <QuickActions
        actions={quickActions}
        visible={showQuickActions}
        onSelect={onQuickAction}
        isDark={isDark}
      />
      <form onSubmit={handleSubmit} className="mt-2 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Habtamu's projects, skills, or contact..."
          aria-label="Chat input"
          className={`max-h-28 min-h-[40px] flex-1 resize-none rounded-xl border px-3 py-2 text-xs outline-none transition ${
            isDark
              ? 'border-white/15 bg-slate-950/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-400 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.35)]'
              : 'border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]'
          }`}
        />
        <motion.button
          type="submit"
          disabled={!value.trim()}
          animate={!value.trim() ? {} : { scale: [1, 1.04, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg disabled:opacity-55"
        >
          Send
        </motion.button>
      </form>
    </div>
  );
}

export default memo(ChatInput);

