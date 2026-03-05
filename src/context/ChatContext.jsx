import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'hatag-chat-history-v1';

export const ChatContext = createContext(null);

const systemIntro = {
  from: 'assistant',
  text: "Hey, I'm HataG 🤖 – Habtamu's AI assistant. Ask me about his projects, skills, experience, or how he can help your team.",
  suggested: true,
};

function loadInitialMessages() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [systemIntro];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [systemIntro];
    return parsed;
  } catch {
    return [systemIntro];
  }
}

function saveMessages(messages) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore
  }
}

function buildSimulatedReply(message) {
  const text = message.toLowerCase();

  if (text.includes('project') || text.includes('build')) {
    return (
      "Habtamu has built several real-world style projects 🚀:\n" +
      '- A Java Spring Boot Job Portal (with MySQL + XAMPP) for matching employers and job seekers.\n' +
      '- A C++/Qt Inventory Management System for tracking stock.\n' +
      '- Helpdesk Ticket Queue, Task Management, Bug Tracking, Crypto Tracker, and a News App.\n\n' +
      "Tell me which tech you care about (e.g. React, Java, Node) and I'll recommend a project to start with ✨."
    );
  }

  if (text.includes('skill') || text.includes('stack') || text.includes('tech')) {
    return (
      'Habtamu is a junior full stack developer focused on clean, modern stacks 💻.\n\n' +
      'Core skills:\n' +
      '- Frontend: HTML, CSS, JavaScript, React, Tailwind.\n' +
      '- Backend: Node.js, Express, Java Spring Boot.\n' +
      '- Databases: MySQL, MongoDB.\n' +
      '- Tools: Git & GitHub.\n\n' +
      'You can ask something like “How does he use React?” or “Tell me about his backend work.”'
    );
  }

  if (text.includes('experience') || text.includes('journey') || text.includes('timeline')) {
    return (
      "Habtamu's journey is very hands-on 📚:\n" +
      '1️⃣ Programming fundamentals in C++ and Java.\n' +
      '2️⃣ Data Structures & Algorithms (queues, stacks, linked lists, etc.).\n' +
      '3️⃣ Real-world style projects: inventory, helpdesk, bug tracker, news app, crypto tracker.\n' +
      '4️⃣ Full stack path with React, Node.js/Express, Java Spring Boot, and MySQL.\n\n' +
      "If you want, I can walk you through this journey like a short story ✨."
    );
  }

  if (text.includes('contact') || text.includes('reach') || text.includes('hire')) {
    return (
      'Habtamu is currently open to junior roles, collaborations, and mock interviews 🤝.\n' +
      'You can reach him via the contact form at the bottom of this page, or by using the social links in the footer.\n\n' +
      'If you share your preferred stack or role, I can suggest which of his projects to review first.'
    );
  }

  if (
    text.includes('react') ||
    text.includes('frontend') ||
    text.includes('javascript') ||
    text.includes('tailwind')
  ) {
    return (
      'For frontend work, Habtamu focuses on React + Tailwind CSS ✨.\n' +
      'Examples:\n' +
      '- Crypto Tracker and News App built with React + APIs.\n' +
      '- This portfolio itself shows his approach to component structure, theming, and animations.\n\n' +
      'Ask “Show me a React-style code snippet” and I can describe how he would structure a component.'
    );
  }

  if (text.includes('java') || text.includes('spring')) {
    return (
      'Java & Spring Boot are central in his Job Portal System 💼.\n' +
      'He uses Spring Boot with MySQL (via XAMPP) to handle job postings, applications, and admin moderation.\n\n' +
      'If you want, I can highlight how this shows backend design and database modeling skills.'
    );
  }

  if (text.includes('node') || text.includes('express') || text.includes('api')) {
    return (
      'On the Node.js side, Habtamu builds REST APIs with Express 🌐.\n' +
      'He applies this in systems like task management and bug tracking, focusing on clean routes and controllers.\n\n' +
      'You can ask: “How does he design APIs?” or “What does his backend folder structure look like?”.'
    );
  }

  if (text.includes('cv') || text.includes('resume')) {
    return (
      'You can request Habtamu’s latest CV/Resume and he can share a downloadable link or PDF 📄.\n' +
      'For this demo, imagine a “Download CV” button that triggers a file download from cloud storage.'
    );
  }

  if (text.includes('meeting') || text.includes('calendar') || text.includes('schedule')) {
    return (
      'For meetings, Habtamu can share a calendar link where you pick a time that works for you 📅.\n' +
      'In this demo, think of a button that opens a prefilled email to suggest a call slot.'
    );
  }

  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return (
      'Hey there 👋, great to meet you!\n' +
      "I'm HataG, here to walk you through Habtamu’s projects, skills, and journey.\n" +
      'You can start with “Show projects”, “What are his skills?”, or “Tell me about his experience.”'
    );
  }

  return (
    "Love that question ✨. I'm a focused assistant for Habtamu's portfolio, so I answer best about:\n" +
    '- His projects and what problems they solve.\n' +
    '- His skills and full stack learning path.\n' +
    '- How he can help your team as a junior developer.\n\n' +
    "Try asking “What projects has he built?” or “Which project best shows his backend skills?” 🚀"
  );
}

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadInitialMessages());
  const [isTyping, setIsTyping] = useState(false);
  const [lastSentAt, setLastSentAt] = useState(0);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([systemIntro]);
  }, []);

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return { accepted: false, reason: 'empty' };

    const now = Date.now();
    if (now - lastSentAt < 2000) {
      return { accepted: false, reason: 'rate_limited' };
    }

    const userMsg = { from: 'user', text: trimmed, ts: now };
    setMessages((prev) => [...prev, userMsg]);
    setLastSentAt(now);

    setIsTyping(true);
    const replyText = buildSimulatedReply(trimmed);
    const delay = Math.min(2200, 600 + trimmed.length * 30);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'assistant',
          text: replyText,
          ts: Date.now(),
        },
      ]);
      setIsTyping(false);
    }, delay);

    return { accepted: true };
  }, [lastSentAt]);

  const value = useMemo(
    () => ({
      isOpen,
      toggleOpen,
      messages,
      isTyping,
      sendMessage,
      clearChat,
    }),
    [isOpen, messages, isTyping, sendMessage, clearChat],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

