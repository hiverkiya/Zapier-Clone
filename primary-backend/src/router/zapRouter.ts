import { Router } from 'express';
import { authMiddleware } from '../authMiddleware';
import { ZapCreateSchema } from '../types/zod';
import { prismaClient } from '../database';

const zapRouter = Router();

zapRouter.post('/', authMiddleware, async (req, res) => {
  console.log('creating a zap');
  //@ts-ignore
  const id = req.id;
  const body = req.body;
  const parsedData = ZapCreateSchema.safeParse(body);
  if (!parsedData.success) {
    return res.status(411).json({
      message: 'Incorrect inputs',
    });
  }

  // we're updating the trigger Id in the end in the transaction

  const zapId = await prismaClient.$transaction(async (tx) => {
    const zap = await prismaClient.zap.create({
      data: {
        userId: parseInt(id),
        triggerId: '',
        actions: {
          create: parsedData.data.actions.map((x, index) => ({
            actionId: x.availableActionId,
            sortingOrder: index,
          })),
        },
      },
    });

    const trigger = await tx.trigger.create({
      data: {
        triggerId: parsedData.data.availableTriggerId,
        zapId: zap.id,
      },
    });
    await prismaClient.zap.update({
      where: {
        id: zap.id,
      },
      data: {
        triggerId: trigger.id,
      },
    });
    return zap.id;
  });

  return res.json({ zapId });
});
zapRouter.get('/', authMiddleware, async (req, res) => {
  console.log('getting a zap');

  //@ts-ignore
  const id = req.id;
  const zaps = await prismaClient.zap.findMany({
    where: {
      userId: id,
    },
    include: {
      actions: {
        include: {
          type: true,
        },
      },
      trigger: {
        include: {
          type: true,
        },
      },
    },
  });
});
zapRouter.get('/:zapId', authMiddleware, async (req, res) => {
  console.log('getting information about a zap');

  //@ts-ignore
  const id = req.id;
  const zapId = req.params.zapId;
  const zap = await prismaClient.zap.findFirst({
    where: {
      id: zapId,
      userId: id,
    },
    include: {
      actions: {
        include: {
          type: true,
        },
      },
      trigger: {
        include: {
          type: true,
        },
      },
    },
  });
  return res.json({
    zap,
  });
});
export default zapRouter;
