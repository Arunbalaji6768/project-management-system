import express from 'express';
import { prisma } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.user.id },
    select: { id: true, status: true },
  });

  const tasks = await prisma.task.findMany({
    where: { userId: req.user.id },
    select: { id: true, status: true },
  });

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter((task) => task.status !== 'COMPLETED').length;
  const inProgressProjects = projects.filter((project) => project.status === 'IN_PROGRESS').length;

  return res.json({
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressProjects,
  });
});

export default router;
