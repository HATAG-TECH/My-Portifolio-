import { getCache, setCache } from '../services/cacheService.js';
import { getProjectById, getProjects } from '../models/jsonStore.js';

function parseQuery(req) {
  const tech = req.query.tech ? String(req.query.tech).trim() : '';
  const sort = req.query.sort === 'complexity' ? 'complexity' : 'date';
  const order = req.query.order === 'asc' ? 'asc' : 'desc';
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  return { tech, sort, order, page, limit };
}

function applyFilterSort(list, { tech, sort, order }) {
  let items = [...list];
  if (tech) {
    const normalized = tech.toLowerCase();
    items = items.filter((project) =>
      (project.techStack || []).some((stack) => stack.toLowerCase().includes(normalized)),
    );
  }

  items.sort((left, right) => {
    if (sort === 'complexity') {
      return order === 'asc' ? left.complexity - right.complexity : right.complexity - left.complexity;
    }
    const leftDate = new Date(left.date || 0).getTime();
    const rightDate = new Date(right.date || 0).getTime();
    return order === 'asc' ? leftDate - rightDate : rightDate - leftDate;
  });
  return items;
}

export async function listProjects(req, res, next) {
  try {
    const query = parseQuery(req);
    const cacheKey = `projects:${JSON.stringify(query)}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const all = await getProjects();
    const filtered = applyFilterSort(all, query);
    const start = (query.page - 1) * query.limit;
    const paginated = filtered.slice(start, start + query.limit);

    const payload = {
      ok: true,
      data: paginated,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / query.limit),
      },
    };
    await setCache(cacheKey, payload, 60);
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}

export async function getProject(req, res, next) {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ ok: false, message: 'Project not found' });
    }
    return res.json({ ok: true, data: project });
  } catch (error) {
    return next(error);
  }
}
