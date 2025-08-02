import { Router } from 'express';
import { authMiddleware } from '../authMiddleware.js';
import { SignInSchema, SignUpSchema } from '../types/zod.js';
import { prismaClient } from '../database';
import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from '../config';

const userRouter = Router();
userRouter.post('/signup', async (req, res) => {
  console.log('Signup handler');
  const body = req.body;
  const parsedData = SignUpSchema.safeParse(body);
  if (!parsedData.success) {
    return res.status(411).json({
      message: 'Incorrect inputs',
    });
  }
  const userExists = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data?.username,
    },
  });
  if (userExists) {
    return res.status(403).json({
      message: 'User already exists',
    });
  }
  await prismaClient.user.create({
    data: {
      email: parsedData.data.username,
      name: parsedData.data.name,
      password: parsedData.data.password,
    },
  });

  return res.json({
    message: 'Send a verification email',
  });
});
userRouter.post('/signin', async (req, res) => {
  console.log('Signin handler');
  const body = req.body;
  const parsedData = SignInSchema.safeParse(body);
  if (!parsedData.success) {
    return res.status(411).json({
      message: 'Invalid inputs',
    });
  }
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password,
    },
  });

  // Signing the JWT

  if (!user) {
    return res.status(403).json({
      message: 'Invalid credentials',
    });
  }
  const token = jwt.sign(
    {
      id: user.id,
    },
    JWT_PASSWORD,
  );
  res.json({
    token: token,
  });
});
userRouter.get('/user', authMiddleware, async (req, res) => {
  console.log('signin handler');
  //@ts-ignore
  const id = req.id;
  const user = await prismaClient.user.findFirst({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return res.json({ user });
});
export default userRouter;
