import { Router } from 'express';
import { authMiddleware } from './authMiddleware';
const userRouter = Router();
userRouter.post('/signup', (req, res) => {
  console.log('Signup handler');
});
userRouter.post('/signin', (req, res) => {
  console.log('Signin handler');
});
userRouter.get('/user', authMiddleware, (req, res) => {
  console.log('signin handler');
});
export default userRouter;
