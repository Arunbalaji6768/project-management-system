import express from 'express';
import { prisma } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { projectSchema, updateProjectSchema } from '../utils/validation.js';

const router = express.Router();

const parseProjectQuery = (value) => {
  if (!value) return undefined;
  return String(value).toUpperCase();
};

const toProjectResponse = (project) => ({
  ...project,
  status: project.status,
});

router.get('/', requireAuth, async (req, res) => {
  const status = parseProjectQuery(req.query.status);
  const search = req.query.search ? String(req.query.search).trim() : '';

  const projects = await prisma.project.findMany({
    where: {
      userId: req.user.id,
      ...(status ? { status } : {}),
      ...(search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(projects.map(toProjectResponse));
});

router.get('/:id', requireAuth, async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
  });

  if (!project || project.userId !== req.user.id) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  return res.json(toProjectResponse(project));
});

router.post('/', requireAuth, async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const payload = parsed.data;

  const project = await prisma.project.create({
    data: {
      name: payload.name,
      description: payload.description || null,
      status: payload.status,
      startDate: payload.startDate ? new Date(payload.startDate) : null,
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      userId: req.user.id,
    },
  });

  return res.status(201).json(toProjectResponse(project));
});

router.put('/:id', requireAuth, async (req, res) => {
  const parsed = updateProjectSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const existingProject = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!existingProject || existingProject.userId !== req.user.id) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const payload = parsed.data;
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: {
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.description !== undefined ? { description: payload.description || null } : {}),
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.startDate !== undefined ? { startDate: payload.startDate ? new Date(payload.startDate) : null } : {}),
      ...(payload.endDate !== undefined ? { endDate: payload.endDate ? new Date(payload.endDate) : null } : {}),
    },
  });

  return res.json(toProjectResponse(project));
});

router.delete('/:id', requireAuth, async (req, res) => {
  const existingProject = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!existingProject || existingProject.userId !== req.user.id) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  await prisma.project.delete({ where: { id: req.params.id } });
  return res.json({ message: 'Project deleted successfully.' });
});

export default router;
