import { chatData } from '../data/chatData.js';

const STATIC_RESUME_PATH = '/resume.pdf';
const PDF_FILENAME = 'Habtamu-Shewamene-Resume.pdf';
const FALLBACK_FILENAME = 'Habtamu-Shewamene-Resume.txt';

let hasStaticResume;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function triggerDownload(url, filename) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function buildResumeText() {
  const profile = chatData.profile;
  const skills = chatData.skills;
  const now = new Date().toISOString().slice(0, 10);

  return [
    `${profile.fullName}`,
    `${profile.role}`,
    '',
    `Email: ${profile.email}`,
    `GitHub: ${profile.github}`,
    `LinkedIn: ${profile.linkedIn}`,
    '',
    'SUMMARY',
    'Junior full-stack developer building practical and scalable web applications with modern frontend and backend technologies.',
    '',
    'TECHNICAL SKILLS',
    `Frontend: ${skills.frontend.join(', ')}`,
    `Backend: ${skills.backend.join(', ')}`,
    `Database: ${skills.database.join(', ')}`,
    `Tools: ${skills.tools.join(', ')}`,
    '',
    'SELECTED PROJECTS',
    ...chatData.projects.slice(0, 5).map((project) => (
      `- ${project.name}: ${project.summary} (${project.stack.join(', ')})`
    )),
    '',
    'EXPERIENCE',
    ...chatData.experience.map((item) => `- ${item.period}: ${item.role} | ${item.details}`),
    '',
    `Generated on: ${now}`,
  ].join('\n');
}

async function staticResumeAvailable() {
  if (typeof hasStaticResume === 'boolean') return hasStaticResume;

  try {
    const response = await fetch(STATIC_RESUME_PATH, { method: 'HEAD', cache: 'no-store' });
    hasStaticResume = response.ok;
  } catch {
    hasStaticResume = false;
  }

  return hasStaticResume;
}

export async function downloadResume() {
  const hasStaticFile = await staticResumeAvailable();
  await wait(420);

  if (hasStaticFile) {
    triggerDownload(STATIC_RESUME_PATH, PDF_FILENAME);
    return { source: 'static' };
  }

  const textBlob = new Blob([buildResumeText()], { type: 'text/plain;charset=utf-8' });
  const objectUrl = URL.createObjectURL(textBlob);
  triggerDownload(objectUrl, FALLBACK_FILENAME);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  return { source: 'generated' };
}
