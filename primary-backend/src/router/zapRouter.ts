import { Router } from 'express';
import { authMiddleware } from './authMiddleware';
const zapRouter = Router();

zapRouter.post('/', authMiddleware, (req, res) => {
  console.log('creating a zap');
});
zapRouter.get('/', authMiddleware, (req, res) => {
  console.log('getting a zap');
});
zapRouter.get('/:zapId', authMiddleware, (req, res) => {
  console.log('getting information about a zap');
});
export default zapRouter;
