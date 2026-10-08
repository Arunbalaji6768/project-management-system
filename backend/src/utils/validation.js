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

const dateInputSchema = z
  .string()
  .refine((value) => {
    if (value === '') return true;

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsedDate = new Date(`${value}T00:00:00.000Z`);
      return (
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === value
      );
    }

    return /^\d{4}-\d{2}-\d{2}T/.test(value) && !Number.isNaN(new Date(value).getTime());
  }, 'Enter a valid date.')
  .nullable()
  .optional()
  .transform((value) => value || null);

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
  startDate: dateInputSchema,
  endDate: dateInputSchema,
});

export const taskSchema = z.object({
  name: z.string().trim().min(1, 'Task name is required.').max(150),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional().default('PENDING'),
  dueDate: dateInputSchema,
  projectId: z.string().uuid('Project ID is required.').optional(),
});

export const updateTaskSchema = taskSchema.partial();
export const updateProjectSchema = projectSchema.partial();
