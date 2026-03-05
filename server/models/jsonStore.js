import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';
import { projectSchema } from './schemas.js';
import { projects as seedProjects } from '../../src/data/projectsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');
const dataDir = path.resolve(rootDir, env.dataDir);
const backupDir = path.resolve(rootDir, env.backupDir);

const files = {
  projects: path.join(dataDir, 'projects.json'),
  contacts: path.join(dataDir, 'contacts.json'),
  visitors: path.join(dataDir, 'visitors.json'),
  chats: path.join(dataDir, 'chats.json'),
};

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function ensureFile(filePath, defaultValue) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
  }
}

async function backupFile(filePath) {
  const stamp = new Date().toISOString().slice(0, 10);
  const baseName = path.basename(filePath, '.json');
  const backupPath = path.join(backupDir, `${baseName}-${stamp}.json`);
  const raw = await fs.readFile(filePath, 'utf8');
  await fs.writeFile(backupPath, raw, 'utf8');
}

async function readJson(filePath, fallback = []) {
  const raw = await fs.readFile(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8');
  await backupFile(filePath);
}

function validateProjects(projects) {
  return projects.map((project) => projectSchema.validate(project, { stripUnknown: true }).value);
}

export async function initializeStore() {
  await ensureDir(dataDir);
  await ensureDir(backupDir);
  await ensureFile(files.projects, seedProjects);
  await ensureFile(files.contacts, []);
  await ensureFile(files.chats, []);
  await ensureFile(files.visitors, {
    totalVisits: 0,
    uniqueVisitors: 0,
    byDay: {},
    seenIps: [],
    lastVisitAt: null,
  });

  const loadedProjects = await readJson(files.projects, []);
  const validatedProjects = validateProjects(loadedProjects);
  if (validatedProjects.length !== loadedProjects.length) {
    await writeJson(files.projects, validatedProjects);
  }
}

export async function getProjects() {
  const loadedProjects = await readJson(files.projects, []);
  return validateProjects(loadedProjects);
}

export async function getProjectById(id) {
  const list = await getProjects();
  return list.find((project) => project.id === id) || null;
}

export async function saveContact(contact) {
  const current = await readJson(files.contacts, []);
  const entry = {
    id: randomUUID(),
    ...contact,
    createdAt: new Date().toISOString(),
  };
  current.push(entry);
  await writeJson(files.contacts, current);
  return entry;
}

export async function saveChatRecord(chatRecord) {
  const current = await readJson(files.chats, []);
  current.push({
    id: randomUUID(),
    ...chatRecord,
    createdAt: new Date().toISOString(),
  });
  if (current.length > 1000) {
    current.splice(0, current.length - 1000);
  }
  await writeJson(files.chats, current);
}

export async function trackVisitor(ipAddress) {
  const data = await readJson(files.visitors, {
    totalVisits: 0,
    uniqueVisitors: 0,
    byDay: {},
    seenIps: [],
    lastVisitAt: null,
  });

  const dayKey = new Date().toISOString().slice(0, 10);
  data.totalVisits += 1;
  data.byDay[dayKey] = (data.byDay[dayKey] || 0) + 1;
  data.lastVisitAt = new Date().toISOString();

  if (ipAddress && !data.seenIps.includes(ipAddress)) {
    data.seenIps.push(ipAddress);
    data.uniqueVisitors += 1;
  }

  await writeJson(files.visitors, data);
  return {
    totalVisits: data.totalVisits,
    uniqueVisitors: data.uniqueVisitors,
    todayVisits: data.byDay[dayKey],
    lastVisitAt: data.lastVisitAt,
  };
}
