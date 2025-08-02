import express from 'express';
import cors from 'cors';
import userRouter from './router/userRouter.js';
import zapRouter from './router/zapRouter.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/zap', zapRouter);
app.listen(3000, () => {
  console.log('The backend is up');
});
