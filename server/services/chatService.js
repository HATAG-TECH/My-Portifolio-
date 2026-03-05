const memory = new Map();
const MAX_HISTORY = 10;

const fallbackReplies = [
  'I can help with Habtamu projects, skills, and contact details. Ask about React, Node.js, or Java.',
  'Try asking for a backend-focused project or a summary of the full stack learning journey.',
  'I can explain project architecture, challenges solved, and the best portfolio examples.',
];

function getIntent(message) {
  const text = message.toLowerCase();
  if (text.includes('project')) return 'projects';
  if (text.includes('skill') || text.includes('stack')) return 'skills';
  if (text.includes('contact') || text.includes('hire')) return 'contact';
  if (text.includes('java') || text.includes('spring')) return 'java';
  if (text.includes('node') || text.includes('express')) return 'node';
  return 'fallback';
}

function buildReply(intent, history) {
  switch (intent) {
    case 'projects':
      return 'Habtamu has strong project depth across full stack, including Job Portal, Helpdesk Queue, Task Management, and Bug Tracker.';
    case 'skills':
      return 'Core stack: React, Tailwind, Node.js/Express, Java/Spring Boot, MySQL, MongoDB, Git, and API integration.';
    case 'contact':
      return 'Use the contact form for collaboration or hiring inquiries. Messages are validated and stored securely.';
    case 'java':
      return 'The Java Job Portal project highlights Spring Boot architecture, role-based flows, and MySQL query optimization.';
    case 'node':
      return 'Node.js projects focus on clean REST APIs, queue/workflow systems, and robust backend structure.';
    default: {
      if (history.some((item) => item.intent === 'projects')) {
        return 'If you want, I can compare two projects by complexity and stack fit for your role.';
      }
      return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    }
  }
}

export function getConversationKey(req, providedSessionId = '') {
  if (providedSessionId) return providedSessionId;
  return req.ip || 'anonymous';
}

export function generateChatResponse({ sessionKey, message }) {
  const history = memory.get(sessionKey) || [];
  const intent = getIntent(message);
  const reply = buildReply(intent, history);

  const updatedHistory = [...history, { intent, message, reply, ts: Date.now() }]
    .slice(-MAX_HISTORY);
  memory.set(sessionKey, updatedHistory);

  return { reply, memorySize: updatedHistory.length };
}
