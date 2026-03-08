import { trackResumeDownloadEvent } from './api.js';

const BASE_FILENAME = 'habtamu-shewamene-resume';
const SUPPORTED_FORMATS = ['pdf', 'docx', 'txt', 'md'];

const RESUME_FILES = {
  pdf: {
    url: '/resumes/pdf/habtamu-shewamene-resume.pdf',
    filename: `${BASE_FILENAME}.pdf`,
  },
  docx: {
    url: '/resumes/docx/habtamu-shewamene-resume.docx',
    filename: `${BASE_FILENAME}.docx`,
  },
  txt: {
    url: '/resumes/txt/habtamu-shewamene-resume.txt',
    filename: `${BASE_FILENAME}.txt`,
  },
  md: {
    url: '/resumes/md/habtamu-shewamene-resume.md',
    filename: `${BASE_FILENAME}.md`,
  },
};

const PROFILE = {
  fullName: 'Habtamu Shewamene',
  role: 'Junior Full-Stack Developer',
  email: 'habtamushewamene905@gmail.com',
  github: 'https://github.com/HATAG-TECH',
  linkedin: 'https://www.linkedin.com/in/habtamu-shewamene-25a5a63b5/',
  location: 'Addis Ababa, Ethiopia',
};

function triggerDownloadFromUrl(url, filename) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function triggerBlobDownload(content, mimeType, filename) {
  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  triggerDownloadFromUrl(objectUrl, filename);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1800);
}

function normalizeInclude(include = {}) {
  return {
    fullResume: include.fullResume !== false,
    skillsMatrix: include.skillsMatrix !== false,
    contactDetails: include.contactDetails === true,
  };
}

function skillsMatrixRows() {
  return [
    ['JavaScript', 'Advanced', 'Frontend + Backend'],
    ['React', 'Advanced', 'Hooks, State, Routing'],
    ['Node.js / Express', 'Intermediate', 'REST APIs, validation, security'],
    ['Java / Spring Boot', 'Intermediate', 'Role-based backend applications'],
    ['MySQL / MongoDB', 'Intermediate', 'Schema design and optimization'],
  ];
}

function buildResumeText(include) {
  const options = normalizeInclude(include);
  const lines = [PROFILE.fullName, PROFILE.role, ''];

  if (options.contactDetails) {
    lines.push(`${PROFILE.location} | ${PROFILE.email}`);
    lines.push(`GitHub: ${PROFILE.github}`);
    lines.push(`LinkedIn: ${PROFILE.linkedin}`);
    lines.push('');
  }

  lines.push('PROFESSIONAL SUMMARY');
  lines.push(
    'Junior full-stack developer focused on React, Node.js, Java Spring Boot, and MySQL with project-based experience shipping practical web applications.',
  );

  if (options.skillsMatrix) {
    lines.push('');
    lines.push('SKILLS MATRIX');
    lines.push('Skill | Level | Focus');
    lines.push('---------------------------------------------');
    skillsMatrixRows().forEach((row) => lines.push(`${row[0]} | ${row[1]} | ${row[2]}`));
  }

  if (options.fullResume) {
    lines.push('');
    lines.push('PROJECT HIGHLIGHTS');
    lines.push('- Job Portal System (Java Spring Boot, MySQL, Thymeleaf)');
    lines.push('- Inventory Management (Node.js, Express, MongoDB, React)');
    lines.push('- Crypto Tracker (React, WebSockets, Chart.js)');
    lines.push('');
    lines.push('EXPERIENCE');
    lines.push('- Junior Full-Stack Developer (Freelance) | 2024 - Present');
    lines.push('- Web Development Intern | 2023 - 2024');
  }

  return lines.join('\n');
}

function buildResumeMarkdown(include) {
  const options = normalizeInclude(include);
  const lines = [`# ${PROFILE.fullName}`, `**${PROFILE.role}**`, ''];

  if (options.contactDetails) {
    lines.push(`- Location: ${PROFILE.location}`);
    lines.push(`- Email: ${PROFILE.email}`);
    lines.push(`- GitHub: ${PROFILE.github}`);
    lines.push(`- LinkedIn: ${PROFILE.linkedin}`);
    lines.push('');
  }

  lines.push('## Professional Summary');
  lines.push(
    'Junior full-stack developer focused on React, Node.js, Java Spring Boot, and MySQL with project-based experience shipping practical web applications.',
  );
  lines.push('');

  if (options.skillsMatrix) {
    lines.push('## Skills Matrix');
    lines.push('| Skill | Level | Focus |');
    lines.push('| --- | --- | --- |');
    skillsMatrixRows().forEach((row) => lines.push(`| ${row[0]} | ${row[1]} | ${row[2]} |`));
    lines.push('');
  }

  if (options.fullResume) {
    lines.push('## Project Highlights');
    lines.push('- Job Portal System (Java Spring Boot, MySQL, Thymeleaf)');
    lines.push('- Inventory Management (Node.js, Express, MongoDB, React)');
    lines.push('- Crypto Tracker (React, WebSockets, Chart.js)');
    lines.push('');
    lines.push('## Experience');
    lines.push('- Junior Full-Stack Developer (Freelance) | 2024 - Present');
    lines.push('- Web Development Intern | 2023 - 2024');
  }

  return lines.join('\n');
}

function shouldGenerateCustom(format, include) {
  const options = normalizeInclude(include);
  const allDefault = options.fullResume && options.skillsMatrix && !options.contactDetails;
  return (format === 'txt' || format === 'md') && !allDefault;
}

export async function downloadResume({
  format = 'pdf',
  placement = 'unknown',
  include = {},
} = {}) {
  const normalizedFormat = String(format || 'pdf').toLowerCase();
  if (!SUPPORTED_FORMATS.includes(normalizedFormat)) {
    throw new Error('Unsupported resume format.');
  }

  const file = RESUME_FILES[normalizedFormat];
  const includeOptions = normalizeInclude(include);
  let source = 'static';

  if (shouldGenerateCustom(normalizedFormat, includeOptions)) {
    source = 'generated-custom';
    if (normalizedFormat === 'txt') {
      triggerBlobDownload(
        buildResumeText(includeOptions),
        'text/plain;charset=utf-8',
        file.filename,
      );
    } else {
      triggerBlobDownload(
        buildResumeMarkdown(includeOptions),
        'text/markdown;charset=utf-8',
        file.filename,
      );
    }
  } else {
    triggerDownloadFromUrl(file.url, file.filename);
  }

  try {
    await trackResumeDownloadEvent({
      format: normalizedFormat,
      placement,
      source,
    });
  } catch {
    // Non-blocking analytics call.
  }

  return { format: normalizedFormat, source };
}
