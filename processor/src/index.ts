import { PrismaClient } from '@prisma/client';
import { Kafka } from 'kafkajs';
const client = new PrismaClient();
const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092'],
});
const TOPIC_NAME = 'zap-events';
async function main() {
  const producer = kafka.producer();
  await producer.connect();
  while (true) {
    const pendingRows = await client.zapRunOutBox.findMany({
      where: {},
      take: 10,
    });
    producer.send({
      topic: TOPIC_NAME,
      messages: pendingRows.map((row) => ({
        value: row.zapRunId,
      })),
    });

    await client.zapRunOutBox.deleteMany({
      where: {
        id: { in: pendingRows.map((x) => x.id) },
      },
    });
  }
}
main();
