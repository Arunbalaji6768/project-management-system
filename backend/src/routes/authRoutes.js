import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { loginSchema, registerSchema } from '../utils/validation.js';

const router = express.Router();

const sanitizeUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  createdAt: user.createdAt,
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { fullName, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
    },
  });

  const token = signToken(user);

  return res.status(201).json({
    message: 'User registered successfully.',
    token,
    user: sanitizeUser(user),
  });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = signToken(user);

  return res.json({
    message: 'Login successful.',
    token,
    user: sanitizeUser(user),
  });
});

router.post('/logout', requireAuth, async (req, res) => {
  return res.json({ message: 'Logged out successfully.' });
});

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

export default router;
