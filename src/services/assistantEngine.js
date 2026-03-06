import {
  assistantCodeSnippets,
  assistantProfile,
  projectsKnowledge,
  experienceTimeline,
} from '../data/assistantKnowledge.js';

const INTENTS = {
  GREETING: 'greeting',
  NAME: 'name',
  ABOUT: 'about',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  PROJECT_DETAIL: 'project_detail',
  EXPERIENCE: 'experience',
  CONTACT: 'contact',
  AVAILABILITY: 'availability',
  LOCATION: 'location',
  CODE: 'code',
  GITHUB: 'github',
  OFF_TOPIC: 'off_topic',
  UNKNOWN: 'unknown',
};

const FOLLOW_UPS = {
  skills: ['Would you like frontend, backend, or Java-focused skills?'],
};

const OFF_TOPIC_HINTS = ['weather', 'movie', 'sports', 'music', 'politics', 'bitcoin price', 'stock'];

function normalize(text) {
  return text.toLowerCase().trim();
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function projectByName(text) {
  return projectsKnowledge.find((project) => {
    const projectName = project.name.toLowerCase();
    return text.includes(project.id) || text.includes(projectName);
  });
}

function techMatcher(text) {
  const tech = ['react', 'node', 'express', 'java', 'spring', 'mysql', 'mongodb', 'javascript', 'html', 'css'];
  return tech.find((token) => text.includes(token)) || null;
}

function recommendProjectsByInterest(tech) {
  if (!tech) return projectsKnowledge.slice(0, 3);
  return projectsKnowledge.filter((project) =>
    project.technologies.some((item) => item.toLowerCase().includes(tech)),
  );
}

function detectIntent(rawText, memory) {
  const text = normalize(rawText);
  if (!text) return INTENTS.UNKNOWN;
  if (includesAny(text, ['hi', 'hello', 'hey'])) return INTENTS.GREETING;
  if (includesAny(text, ['your name', 'who are you', 'what is your name'])) return INTENTS.NAME;
  if (includesAny(text, ['tell me about habtamu', 'who is habtamu', 'about habtamu', 'bio'])) return INTENTS.ABOUT;
  if (includesAny(text, ['skill', 'technology', 'tech stack', 'does he know'])) return INTENTS.SKILLS;
  if (includesAny(text, ['project', 'built', 'portfolio'])) return INTENTS.PROJECTS;
  if (includesAny(text, ['job portal', 'crypto tracker', 'inventory', 'helpdesk', 'task management', 'bug tracking', 'news app'])) {
    return INTENTS.PROJECT_DETAIL;
  }
  if (includesAny(text, ['experience', 'timeline', 'years'])) return INTENTS.EXPERIENCE;
  if (includesAny(text, ['contact', 'email', 'reach'])) return INTENTS.CONTACT;
  if (includesAny(text, ['available', 'availability', 'open for work', 'hire'])) return INTENTS.AVAILABILITY;
  if (includesAny(text, ['where is he based', 'location', 'where are you'])) return INTENTS.LOCATION;
  if (includesAny(text, ['code', 'snippet', 'example code', 'show me code'])) return INTENTS.CODE;
  if (includesAny(text, ['github'])) return INTENTS.GITHUB;
  if (includesAny(text, OFF_TOPIC_HINTS)) return INTENTS.OFF_TOPIC;
  if (includesAny(text, ['that project', 'this project', 'it use', 'what about it']) && memory.lastIntent === INTENTS.PROJECT_DETAIL) {
    return INTENTS.PROJECT_DETAIL;
  }
  return INTENTS.UNKNOWN;
}

function projectsListText() {
  return projectsKnowledge.map((project) => `- ${project.name} (${project.technologies.slice(0, 2).join(' + ')})`).join('\n');
}

function formatProject(project) {
  const features = project.features.slice(0, 4).map((feature) => `- ${feature}`).join('\n');
  return (
    `🚀 ${project.name} (${project.year})\n` +
    `${project.description}\n\n` +
    `Tech: ${project.technologies.join(', ')}\n` +
    `Key features:\n${features}\n\n` +
    `Challenge: ${project.challenge}\n` +
    `Solution: ${project.solution}\n\n` +
    `GitHub: ${project.github}\n` +
    `Live Demo: ${project.liveDemo}`
  );
}

function buildCodeSnippet(tech) {
  const key = tech?.includes('java') || tech?.includes('spring')
    ? 'java'
    : tech?.includes('node') || tech?.includes('express')
      ? 'node'
      : 'react';
  const snippet = assistantCodeSnippets[key];
  return (
    `🔧 ${snippet.title}\n\n` +
    `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\``
  );
}

export function createInitialAssistantMessage() {
  return {
    from: 'assistant',
    text:
      "👋 I'm Habtamu's AI assistant! I can help with his projects, skills, experience, availability, and contact details. Ask me anything.",
    ts: Date.now(),
    intent: 'intro',
  };
}

export function generateAssistantReply(input, memory) {
  const text = normalize(input);
  const intent = detectIntent(input, memory);
  const detectedTech = techMatcher(text);
  const targetProject = projectByName(text) || (memory.lastProjectId
    ? projectsKnowledge.find((project) => project.id === memory.lastProjectId)
    : null);

  switch (intent) {
    case INTENTS.GREETING:
      return {
        intent,
        lastProjectId: null,
        text:
          "👋 Welcome! I'm here to represent Habtamu Shewamene's portfolio. Ask about projects, skills, or availability and I will guide you.",
      };
    case INTENTS.NAME:
      return {
        intent,
        lastProjectId: null,
        text:
          "👋 I'm Habtamu's AI assistant! Habtamu Shewamene is a junior full-stack developer passionate about building modern web applications. Would you like to know about his skills or projects?",
      };
    case INTENTS.ABOUT:
      return {
        intent,
        lastProjectId: null,
        text:
          `✨ ${assistantProfile.fullName} is a ${assistantProfile.role}. ${assistantProfile.bio}\n\n` +
          `📍 Location: ${assistantProfile.location}\n` +
          `🎯 Career goals: ${assistantProfile.goals.join('; ')}\n` +
          'Want a quick summary of his top projects or technical strengths?',
      };
    case INTENTS.SKILLS:
      return {
        intent,
        lastProjectId: null,
        text:
          '💻 Habtamu is proficient in:\n' +
          'Frontend: React, HTML, CSS, JavaScript\n' +
          'Backend: Node.js, Express, Java Spring Boot\n' +
          'Database: MySQL, MongoDB\n' +
          'Tools: Git, GitHub, VS Code, XAMPP\n\n' +
          `${FOLLOW_UPS.skills[0]} 🚀`,
      };
    case INTENTS.PROJECTS: {
      const recommendations = recommendProjectsByInterest(detectedTech);
      const list = recommendations.length > 0 ? recommendations : projectsKnowledge;
      return {
        intent,
        lastProjectId: list[0]?.id || null,
        text:
          '🚀 Habtamu has built 7 impressive projects! His main project is Job Portal System with Java Spring Boot.\n\n' +
          `${projectsListText()}\n\n` +
          `✨ Recommended for ${detectedTech || 'general visitors'}: ${list.slice(0, 3).map((item) => item.name).join(', ')}\n` +
          'Which project should I open first?',
      };
    }
    case INTENTS.PROJECT_DETAIL:
      if (targetProject) {
        return {
          intent,
          lastProjectId: targetProject.id,
          text: formatProject(targetProject),
        };
      }
      return {
        intent,
        lastProjectId: null,
        text:
          'I can break down any of these projects: Crypto Tracker, Inventory Management System, Helpdesk Queue System, Task Management System, Bug Tracking System, News App, or Job Portal System. Which one would you like? 💡',
      };
    case INTENTS.EXPERIENCE:
      return {
        intent,
        lastProjectId: null,
        text:
          '📈 Experience timeline:\n\n' +
          experienceTimeline
            .map(
              (item) =>
                `- ${item.period}: ${item.role} at ${item.company}\n  Responsibilities: ${item.responsibilities[0]}\n  Achievement: ${item.achievements[0]}`,
            )
            .join('\n\n') +
          '\n\nWould you like a role-focused summary for frontend or backend work?',
      };
    case INTENTS.CONTACT:
      return {
        intent,
        lastProjectId: null,
        text:
          `📬 You can reach Habtamu at ${assistantProfile.email}.\n` +
          `GitHub: ${assistantProfile.links.github}\n` +
          'For opportunities, the contact form in this portfolio is the fastest path. 🌐',
      };
    case INTENTS.AVAILABILITY:
      return {
        intent,
        lastProjectId: null,
        text:
          `✅ Yes! Habtamu is actively looking for junior full-stack developer opportunities. You can reach him via ${assistantProfile.email} or the contact form below. Want to see his best project first?`,
      };
    case INTENTS.LOCATION:
      return {
        intent,
        lastProjectId: null,
        text: `📍 Habtamu is based in ${assistantProfile.location}.`,
      };
    case INTENTS.GITHUB:
      return {
        intent,
        lastProjectId: null,
        text: `🌐 You can view Habtamu's GitHub here: ${assistantProfile.links.github}`,
      };
    case INTENTS.CODE:
      return {
        intent,
        lastProjectId: targetProject?.id || null,
        text:
          'Here is a sample code style Habtamu uses in projects. 💻\n\n' + buildCodeSnippet(detectedTech || targetProject?.technologies?.join(' ')),
      };
    case INTENTS.OFF_TOPIC:
      return {
        intent,
        lastProjectId: null,
        text:
          "I'm focused on Habtamu's portfolio topics. I can help with projects, skills, experience, or contact details. What should we explore? ✨",
      };
    default:
      return {
        intent: INTENTS.UNKNOWN,
        lastProjectId: null,
        text:
          "I'm not sure about that, but I can tell you about Habtamu's projects, skills, or experience. What would you like to know?",
      };
  }
}

export function createAssistantMemory() {
  return {
    lastIntent: null,
    lastProjectId: null,
  };
}

export function updateMemory(memory, reply) {
  return {
    lastIntent: reply.intent || memory.lastIntent,
    lastProjectId: reply.lastProjectId ?? memory.lastProjectId,
  };
}

