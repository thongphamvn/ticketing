import Queue, { Job } from "bull";
import { ExpirationCompletedPublisher } from "../events/publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job: Job<Payload>) => {
  console.log("Expiration completed", job.data.orderId);
  await new ExpirationCompletedPublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
