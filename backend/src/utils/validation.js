import { z } from 'zod';

export const emailSchema = z.string().trim().email('Valid email is required.');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long.');

export const parseDateValue = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
};

export const projectStatusValues = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
export const taskPriorityValues = ['LOW', 'MEDIUM', 'HIGH'];
export const taskStatusValues = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required.').max(100),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
});

export const projectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required.').max(150),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional().default('NOT_STARTED'),
  startDate: z.union([z.string().datetime({ offset: true }).nullable(), z.string().datetime().nullable()]).optional().or(z.literal('')).transform((value) => value || null),
  endDate: z.union([z.string().datetime({ offset: true }).nullable(), z.string().datetime().nullable()]).optional().or(z.literal('')).transform((value) => value || null),
});

export const taskSchema = z.object({
  name: z.string().trim().min(1, 'Task name is required.').max(150),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional().default('PENDING'),
  dueDate: z.union([z.string().datetime({ offset: true }).nullable(), z.string().datetime().nullable()]).optional().or(z.literal('')).transform((value) => value || null),
  projectId: z.string().uuid('Project ID is required.').optional(),
});

export const updateTaskSchema = taskSchema.partial();
export const updateProjectSchema = projectSchema.partial();
