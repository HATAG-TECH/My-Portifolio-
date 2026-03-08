import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme.js';
import { chatData } from '../../data/chatData.js';
import { downloadResume } from '../../services/resume.js';
import { parseVoiceCommand, voiceCommandsCatalog } from '../../services/voiceCommands.js';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant.js';
import ChatMessage from './ChatMessage.jsx';
import ChatInput from './ChatInput.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import VoiceSettingsPanel from './VoiceSettingsPanel.jsx';
import VoiceCommandsGuide from './VoiceCommandsGuide.jsx';

const QUICK_ACTIONS = [
  { id: 'about', label: 'About Me', prompt: 'Tell me about Habtamu' },
  { id: 'projects', label: 'Projects', prompt: 'What projects has he built?' },
  { id: 'skills', label: 'Skills', prompt: 'What are his skills?' },
  { id: 'resume', label: 'Resume', prompt: 'Can I download your resume?' },
  { id: 'contact', label: 'Contact', prompt: 'How can I contact him?' },
];

function normalize(value) {
  return value.toLowerCase().trim();
}

function hasAny(text, keywords) {
  return keywords.some((word) => text.includes(word));
}

function formatProjectList(projects) {
  return projects.map((project) => `- ${project.name} (${project.stack.join(', ')})`).join('\n');
}

function formatProjectDetails(project) {
  return (
    `${project.name}\n` +
    `${project.summary}\n` +
    `Tech: ${project.stack.join(', ')}\n` +
    `${project.highlights.map((item) => `- ${item}`).join('\n')}`
  );
}

function resolveProjectByKeyword(text) {
  const words = normalize(text);
  return chatData.projects.find((project) => {
    const name = project.name.toLowerCase();
    const stack = project.stack.join(' ').toLowerCase();
    return words.includes(project.id) || words.includes(name) || words.includes(stack);
  });
}

function resolveProjectSuggestions(text) {
  const normalized = normalize(text);

  if (hasAny(normalized, ['java', 'spring'])) {
    return chatData.projects.filter((project) =>
      project.stack.some((tech) => ['java', 'spring boot'].includes(tech.toLowerCase())),
    );
  }

  if (hasAny(normalized, ['react'])) {
    return chatData.projects.filter((project) =>
      project.stack.some((tech) => tech.toLowerCase().includes('react')),
    );
  }

  if (hasAny(normalized, ['node', 'express', 'backend', 'api'])) {
    return chatData.projects.filter((project) =>
      project.stack.some((tech) => ['node.js', 'express'].includes(tech.toLowerCase())),
    );
  }

  return chatData.projects;
}

function createWelcomeMessage() {
  return {
    id: `assistant-welcome-${Date.now()}`,
    role: 'assistant',
    content:
      `Hi. I am Habtamu's portfolio assistant.\n` +
      `You can ask about projects, skills, experience, or contact details.`,
    ts: Date.now(),
    intent: 'welcome',
  };
}

function spokenFriendlyText(content) {
  return String(content || '')
    .replace(/👋/g, 'waving hand')
    .replace(/✨/g, 'sparkles')
    .replace(/🚀/g, 'rocket')
    .replace(/✅/g, 'check mark')
    .replace(/📍/g, 'location pin')
    .replace(/📬/g, 'mailbox')
    .replace(/🌐/g, 'globe')
    .replace(/💻/g, 'laptop')
    .replace(/🙌/g, 'celebration')
    .replace(/[•]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (!element) return false;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

function generateSmartReply(input, context) {
  const text = normalize(input);
  const activeProject = context.lastProjectId
    ? chatData.projects.find((project) => project.id === context.lastProjectId)
    : null;

  if (hasAny(text, ['name', 'who are you', 'full name'])) {
    return {
      intent: 'name',
      lastProjectId: context.lastProjectId,
      content: `${chatData.profile.fullName} - ${chatData.profile.role}.`,
    };
  }

  if (hasAny(text, ['skills', 'technologies', 'tech stack'])) {
    return {
      intent: 'skills',
      lastProjectId: context.lastProjectId,
      content:
        `Skills and technologies:\n` +
        `Frontend: ${chatData.skills.frontend.join(', ')}\n` +
        `Backend: ${chatData.skills.backend.join(', ')}\n` +
        `Database: ${chatData.skills.database.join(', ')}\n` +
        `Tools: ${chatData.skills.tools.join(', ')}`,
    };
  }

  if (hasAny(text, ['project', 'projects', 'portfolio'])) {
    const suggestions = resolveProjectSuggestions(text);
    const firstProject = suggestions[0] || chatData.projects[0];
    return {
      intent: 'projects',
      lastProjectId: firstProject?.id || null,
      content:
        `Habtamu has built ${chatData.projects.length} strong projects:\n` +
        `${formatProjectList(suggestions)}\n\n` +
        `Which one interests you most?`,
    };
  }

  if (hasAny(text, ['tell me more about that one', 'that one', 'more about it', 'tell me more'])) {
    if (activeProject) {
      return {
        intent: 'project_detail',
        lastProjectId: activeProject.id,
        content: formatProjectDetails(activeProject),
      };
    }
    return {
      intent: 'project_detail',
      lastProjectId: context.lastProjectId,
      content: `Tell me which project you want details for: ${chatData.projects.map((p) => p.name).join(', ')}.`,
    };
  }

  if (hasAny(text, ['what else', 'anything else', 'more options'])) {
    const remaining = chatData.projects.filter((project) => project.id !== context.lastProjectId);
    return {
      intent: 'projects',
      lastProjectId: remaining[0]?.id || context.lastProjectId,
      content: `Here are more options:\n${formatProjectList(remaining.slice(0, 5))}`,
    };
  }

  if (hasAny(text, ['contact', 'email', 'reach'])) {
    return {
      intent: 'contact',
      lastProjectId: context.lastProjectId,
      content:
        `Email: ${chatData.profile.email}\n` +
        `Use the contact form on this page for opportunities and collaboration requests.`,
    };
  }

  if (hasAny(text, ['resume', 'cv', 'curriculum vitae'])) {
    return {
      intent: 'resume',
      lastProjectId: context.lastProjectId,
      content:
        `You can download Habtamu's resume from three places:\n` +
        `- Hero section: "Get Resume"\n` +
        `- About section: "Download CV"\n` +
        `- Contact section: "My Resume"`,
    };
  }

  if (hasAny(text, ['experience', 'timeline', 'background'])) {
    return {
      intent: 'experience',
      lastProjectId: context.lastProjectId,
      content:
        `Experience timeline:\n` +
        chatData.experience
          .map((item) => `- ${item.period}: ${item.role}\n  ${item.details}`)
          .join('\n'),
    };
  }

  if (hasAny(text, ['java', 'spring'])) {
    const jobPortal = chatData.projects.find((project) => project.id === 'job-portal');
    return {
      intent: 'project_detail',
      lastProjectId: jobPortal?.id || context.lastProjectId,
      content:
        `For Java/Spring work, the standout project is ${jobPortal?.name}.\n` +
        `${jobPortal ? formatProjectDetails(jobPortal) : ''}`,
    };
  }

  if (hasAny(text, ['react'])) {
    const reactProjects = chatData.projects.filter((project) =>
      ['crypto-tracker', 'news-app'].includes(project.id),
    );
    return {
      intent: 'projects',
      lastProjectId: reactProjects[0]?.id || context.lastProjectId,
      content:
        `React-focused projects:\n${formatProjectList(reactProjects)}\n` +
        `Crypto Tracker and News App are great to review first.`,
    };
  }

  if (hasAny(text, ['github'])) {
    return {
      intent: 'github',
      lastProjectId: context.lastProjectId,
      content: `GitHub: ${chatData.profile.github}`,
    };
  }

  const explicitProject = resolveProjectByKeyword(text);
  if (explicitProject) {
    return {
      intent: 'project_detail',
      lastProjectId: explicitProject.id,
      content: formatProjectDetails(explicitProject),
    };
  }

  return {
    intent: 'fallback',
    lastProjectId: context.lastProjectId,
    content:
      `I'm not sure about that, but I can tell you about Habtamu's:\n` +
      `• Projects (7 full-stack applications)\n` +
      `• Skills (React, Java, Node.js, etc.)\n` +
      `• Experience and background\n` +
      `• How to contact him\n\n` +
      `What would you like to know?`,
  };
}

export default function ChatAssistant() {
  const { isDark, toggleTheme, setThemeMode, setManualTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  const contextRef = useRef({ lastIntent: null, lastProjectId: null });
  const scrollRef = useRef(null);
  const replyTimeoutRef = useRef(null);

  const voice = useVoiceAssistant({
    onTranscriptFinal: (transcript) => {
      handleVoiceTranscript(transcript);
    },
    onRecognitionError: (errorMessage) => {
      setHelperText(errorMessage);
    },
  });

  const showQuickActions = !draft.trim();

  const lastAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant');

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
    const onKeyDown = (event) => {
      const shortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'm';
      if (!shortcut || !isOpen) return;
      event.preventDefault();
      voice.toggleListening();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, voice]);

  const resetConversation = () => {
    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    setMessages([]);
    setDraft('');
    setIsTyping(false);
    setHelperText('');
    contextRef.current = { lastIntent: null, lastProjectId: null };
  };

  const openChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setMessages([createWelcomeMessage()]);
    setHelperText('Voice shortcut: Ctrl/Cmd + M to start listening.');
    contextRef.current = { lastIntent: null, lastProjectId: null };
  };

  const closeChat = () => {
    voice.stopListening();
    voice.stopSpeaking();
    setIsOpen(false);
    setUnreadCount(0);
    resetConversation();
  };

  const handleToggle = () => {
    if (isOpen) {
      closeChat();
      return;
    }
    openChat();
  };

  const stopGenerating = () => {
    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    setIsTyping(false);
    setHelperText('Response stopped.');
  };

  const appendAssistantMessage = (content, intent = 'voice_action') => {
    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content,
      ts: Date.now(),
      intent,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    if (voice.autoPlay) {
      voice.speak(spokenFriendlyText(content), assistantMessage.id);
    }
  };

  const handleVoiceCommand = async (command) => {
    switch (command.type) {
      case 'navigate': {
        const ok = scrollToSection(command.target);
        if (ok) {
          appendAssistantMessage(`Taking you to ${command.target} now.`, 'navigation');
        }
        return true;
      }
      case 'chat-open':
        if (!isOpen) openChat();
        appendAssistantMessage('Chat is open.', 'chat');
        return true;
      case 'chat-close':
        appendAssistantMessage('Closing chat window now.', 'chat');
        window.setTimeout(closeChat, 350);
        return true;
      case 'theme-toggle':
        toggleTheme();
        appendAssistantMessage('Switching theme now.', 'theme');
        return true;
      case 'theme-dark':
        setThemeMode('manual');
        setManualTheme('dark');
        appendAssistantMessage('Dark mode enabled.', 'theme');
        return true;
      case 'theme-light':
        setThemeMode('manual');
        setManualTheme('light');
        appendAssistantMessage('Light mode enabled.', 'theme');
        return true;
      case 'resume-download':
        await downloadResume({ format: 'pdf', placement: 'chat' });
        appendAssistantMessage('Starting your resume download now.', 'resume');
        return true;
      case 'voice-sleep':
        voice.setIsVoiceAwake(false);
        voice.stopListening();
        appendAssistantMessage('Voice mode is sleeping. Say wake up when you need me.', 'voice');
        return true;
      case 'voice-wake':
        voice.setIsVoiceAwake(true);
        appendAssistantMessage('Voice mode is active again.', 'voice');
        return true;
      case 'repeat-last':
        if (lastAssistantMessage) {
          voice.speak(spokenFriendlyText(lastAssistantMessage.content), lastAssistantMessage.id);
        }
        return true;
      case 'speak-stop':
        voice.stopSpeaking();
        return true;
      case 'speak-pause':
        voice.pauseSpeaking();
        return true;
      case 'speak-resume':
        voice.resumeSpeaking();
        return true;
      case 'rate-up':
        voice.setSpeechRate((prev) => Math.min(2, Number(prev) + 0.1));
        appendAssistantMessage('Speaking a little faster now.', 'voice');
        return true;
      case 'rate-down':
        voice.setSpeechRate((prev) => Math.max(0.5, Number(prev) - 0.1));
        appendAssistantMessage('Speaking a little slower now.', 'voice');
        return true;
      case 'chat-clear':
        resetConversation();
        setMessages([createWelcomeMessage()]);
        appendAssistantMessage('Chat has been cleared.', 'chat');
        return true;
      case 'voice-help':
        setShowVoiceGuide(true);
        appendAssistantMessage('Opening the voice command guide now.', 'voice_help');
        return true;
      case 'ask':
        if (command.question) {
          sendMessage(command.question);
          return true;
        }
        return false;
      default:
        return false;
    }
  };

  function handleVoiceTranscript(transcript) {
    if (!transcript?.trim()) return;

    const command = parseVoiceCommand(transcript);
    if (command) {
      handleVoiceCommand(command).catch(() => {
        setHelperText('Voice command failed. Please try again.');
      });
      return;
    }

    setDraft(transcript);
    sendMessage(transcript);
  }

  useEffect(() => {
    if (!isOpen) return;
    if (!messages.length) {
      setMessages([createWelcomeMessage()]);
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
      replyTimeoutRef.current = null;
      try {
        const reply = generateSmartReply(trimmed, contextRef.current);
        contextRef.current = {
          lastIntent: reply.intent,
          lastProjectId: reply.lastProjectId,
        };

        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply.content,
          ts: Date.now(),
          intent: reply.intent,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);

        if (voice.autoPlay) {
          voice.speak(spokenFriendlyText(assistantMessage.content), assistantMessage.id);
        }

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
    ? 'text-white'
    : 'text-slate-900';

  const themeTokens = isDark
    ? {
        chatBg: 'rgba(10, 25, 41, 0.95)',
        chatBorder: 'rgba(59, 130, 246, 0.3)',
        userMessage: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        aiMessage: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        textPrimary: '#ffffff',
        textSecondary: '#cbd5e1',
        inputBg: '#1e293b',
        inputBorder: '#334155',
        quickActionBg: '#1e293b',
        quickActionHover: '#334155',
      }
    : {
        chatBg: 'rgba(255, 255, 255, 0.95)',
        chatBorder: 'rgba(59, 130, 246, 0.2)',
        userMessage: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        aiMessage: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        textPrimary: '#0f172a',
        textSecondary: '#334155',
        inputBg: '#f8fafc',
        inputBorder: '#e2e8f0',
        quickActionBg: '#f1f5f9',
        quickActionHover: '#e2e8f0',
      };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={handleToggle}
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
            className={`fixed relative z-40 border shadow-2xl backdrop-blur-xl ${windowClass} bottom-20 right-4 left-4 rounded-2xl sm:left-auto sm:w-[380px]`}
            style={{ background: themeTokens.chatBg, borderColor: themeTokens.chatBorder }}
            role="dialog"
            aria-label="Portfolio AI assistant"
          >
            <header className="flex items-center justify-between border-b px-3 py-2" style={{ borderBottomColor: themeTokens.chatBorder }}>
              <div>
                <h2 className="font-heading text-sm font-semibold" style={{ color: themeTokens.textPrimary }}>AI Assistant</h2>
                <p className="text-[11px]" style={{ color: themeTokens.textSecondary }}>
                  Ask about Habtamu's projects, skills, and contact details
                </p>
                <p className="text-[10px]" style={{ color: themeTokens.textSecondary }}>
                  {voice.compatibility.summary}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowVoiceGuide((prev) => !prev)}
                  className="rounded-md px-2 py-1 text-xs"
                  style={{ background: themeTokens.quickActionBg, color: themeTokens.textPrimary }}
                  aria-label="Voice command guide"
                >
                  Commands
                </button>
                <button
                  type="button"
                  onClick={() => setShowVoiceSettings((prev) => !prev)}
                  className="rounded-md px-2 py-1 text-xs"
                  style={{ background: themeTokens.quickActionBg, color: themeTokens.textPrimary }}
                  aria-label="Voice settings"
                >
                  Voice
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  className="rounded-md px-2 py-1 text-xs"
                  style={{ background: themeTokens.quickActionBg, color: themeTokens.textPrimary }}
                  aria-label="Close chat"
                >
                  Close
                </button>
              </div>
            </header>

            <VoiceSettingsPanel
              open={showVoiceSettings}
              onClose={() => setShowVoiceSettings(false)}
              voice={voice}
              themeTokens={themeTokens}
            />

            <div
              ref={scrollRef}
              className="max-h-[52vh] space-y-2 overflow-y-auto px-3 py-3 sm:max-h-[420px]"
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isDark={isDark}
                  themeTokens={themeTokens}
                  isBeingSpoken={voice.isSpeaking && voice.spokenMessageId === message.id}
                  spokenCharIndex={voice.spokenCharIndex}
                />
              ))}
              {isTyping && <TypingIndicator onStop={stopGenerating} themeTokens={themeTokens} />}
            </div>

            <div className="mx-3 mb-2 rounded-xl border px-3 py-2 text-[11px]" style={{ borderColor: themeTokens.chatBorder, background: themeTokens.quickActionBg, color: themeTokens.textSecondary }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={voice.toggleListening}
                    disabled={!voice.isVoiceEnabled || !voice.isVoiceAwake || !voice.support.hasRecognition}
                    className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full text-white ${voice.isListening ? 'bg-red-500' : 'bg-blue-500'}`}
                    aria-label="Toggle voice listening"
                    title={voice.isListening ? 'Listening...' : 'Start voice input (Ctrl/Cmd + M)'}
                  >
                    {voice.isListening && (
                      <motion.span
                        className="absolute inset-0 rounded-full border border-red-200"
                        animate={{ scale: [1, 1.25, 1], opacity: [0.9, 0.3, 0.9] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    )}
                    <span>{voice.isListening ? '◉' : '🎤'}</span>
                  </button>
                  <div className="w-20 rounded-full bg-slate-500/20">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${Math.max(4, Math.round(voice.volumeLevel * 100))}%` }}
                    />
                  </div>
                  <span>
                    {voice.isListening ? 'Listening...' : voice.isProcessing ? 'Processing...' : 'Idle'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => voice.speak(spokenFriendlyText(lastAssistantMessage?.content || ''), lastAssistantMessage?.id)} className="rounded px-2 py-1" style={{ background: themeTokens.inputBg }}>Play</button>
                  <button type="button" onClick={voice.isSpeechPaused ? voice.resumeSpeaking : voice.pauseSpeaking} className="rounded px-2 py-1" style={{ background: themeTokens.inputBg }}>
                    {voice.isSpeechPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button type="button" onClick={voice.stopSpeaking} className="rounded px-2 py-1" style={{ background: themeTokens.inputBg }}>Stop</button>
                </div>
              </div>

              {voice.interimTranscript && (
                <p className="mt-1 italic">Heard: {voice.interimTranscript}</p>
              )}
              {voice.recognitionError && (
                <p className="mt-1 text-red-400">{voice.recognitionError}</p>
              )}
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
              isGenerating={isTyping}
              onStopGenerating={stopGenerating}
              themeTokens={themeTokens}
            />

            <VoiceCommandsGuide
              open={showVoiceGuide}
              onClose={() => setShowVoiceGuide(false)}
              commands={voiceCommandsCatalog}
              themeTokens={themeTokens}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
