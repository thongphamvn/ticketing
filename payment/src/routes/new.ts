import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@thongphamvn/ticketing-common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publisher";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  `/api/payments`,
  requireAuth,
  [body("token").notEmpty(), body("orderId").notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.currentUser?.id,
    });

    if (!order) {
      throw new NotFoundError(`Order not found`);
    }

    console.log(order);
    if (order.status !== OrderStatus.Created) {
      throw new BadRequestError(`Invalid order state`);
    }

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      orderId: order.id,
      id: "any_payment_id",
    });

    res.send({ success: true, id: "any_payment_id" });
  }
);

export { router as createChargeRouter };
