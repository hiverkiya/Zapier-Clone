import express from 'express';
import { PrismaClient } from '@prisma/client';
const app = express();
const client = new PrismaClient();
// https://hooks.zapier.com/hooks/catch/24045762/u49e6si/
app.use(express.json());
app.post('/hooks/catch/:userId/:zapId', async (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const body = req.body;

  await client.$transaction(async (tx) => {
    const run = await client.zapRun.create({
      data: {
        zapId: zapId,
        metadata: body,
      },
    });
    await client.zapRunOutBox.create({
      data: {
        zapRunId: run.id,
      },
    });
  });
  //store a trigger in a DB

  //push triggers in a queue (kafka/redis)
});
