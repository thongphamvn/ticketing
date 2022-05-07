import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@thongphamvn/ticketing-common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../queues/expiration-queue";

const queueGroupName = "expiration-service";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;
  async onMessage(
    { id, expiredAt }: OrderCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    const delay = new Date(expiredAt).getTime() - new Date().getTime();
    console.log(
      `waiting this milliseconds to process the job`,
      delay,
      typeof delay
    );
    await expirationQueue.add({ orderId: id }, { delay: Number(delay) });

    message.ack();
  }
}
