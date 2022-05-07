import {
  Listener,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@thongphamvn/ticketing-common";
import { Message } from "node-nats-streaming";
import { Order } from "../models/order";

const queueGroupName = "payment-service";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    const { id, userId, price, status, version } = data;

    const order = Order.build({ id, userId, price, status, version });
    await order.save();

    message.ack();
  }
}

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent["data"],
    message: Message
  ): Promise<void> {
    const { id, version } = data;

    const order = await Order.findOne({
      id,
      version: version - 1,
    });

    if (!order) {
      return;
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    message.ack();
  }
}
