import express from 'express';
import { prisma } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { taskSchema, updateTaskSchema } from '../utils/validation.js';

const router = express.Router();

const parseTaskFilter = (value) => {
  if (!value) return undefined;
  return String(value).toUpperCase();
};

const formatTask = (task) => ({
  ...task,
  project: task.project,
});

router.get('/', requireAuth, async (req, res) => {
  const status = parseTaskFilter(req.query.status);
  const priority = parseTaskFilter(req.query.priority);
  const projectId = req.query.projectId ? String(req.query.projectId) : undefined;
  const search = req.query.search ? String(req.query.search).trim() : '';

  const tasks = await prisma.task.findMany({
    where: {
      userId: req.user.id,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(projectId ? { projectId } : {}),
      ...(search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {}),
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(tasks.map(formatTask));
});

router.get('/:id', requireAuth, async (req, res) => {
  const task = await prisma.task.findUnique({
    where: { id: req.params.id },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!task || task.userId !== req.user.id) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  return res.json(formatTask(task));
});

router.post('/', requireAuth, async (req, res) => {
  const parsed = taskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const payload = parsed.data;

  if (!payload.projectId) {
    return res.status(400).json({ message: 'Project ID is required.' });
  }

  const project = await prisma.project.findUnique({
    where: { id: payload.projectId },
  });

  if (!project || project.userId !== req.user.id) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const task = await prisma.task.create({
    data: {
      name: payload.name,
      description: payload.description || null,
      priority: payload.priority || 'MEDIUM',
      status: payload.status || 'PENDING',
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
      projectId: payload.projectId,
      userId: req.user.id,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return res.status(201).json(formatTask(task));
});

router.put('/:id', requireAuth, async (req, res) => {
  const parsed = updateTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const existingTask = await prisma.task.findUnique({
    where: { id: req.params.id },
  });

  if (!existingTask || existingTask.userId !== req.user.id) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const payload = parsed.data;

  let targetProjectId = existingTask.projectId;
  if (payload.projectId) {
    const project = await prisma.project.findUnique({ where: { id: payload.projectId } });
    if (!project || project.userId !== req.user.id) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    targetProjectId = payload.projectId;
  }

  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: {
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.description !== undefined ? { description: payload.description || null } : {}),
      ...(payload.priority ? { priority: payload.priority } : {}),
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.dueDate !== undefined ? { dueDate: payload.dueDate ? new Date(payload.dueDate) : null } : {}),
      ...(payload.projectId ? { projectId: targetProjectId } : {}),
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return res.json(formatTask(task));
});

router.delete('/:id', requireAuth, async (req, res) => {
  const existingTask = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!existingTask || existingTask.userId !== req.user.id) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  await prisma.task.delete({ where: { id: req.params.id } });
  return res.json({ message: 'Task deleted successfully.' });
});

export default router;
