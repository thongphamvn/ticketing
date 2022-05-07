import mongoose from "mongoose";
import { app } from "./app";
import {
  OrderCancelledListener,
  OrderCreatedListener,
} from "./events/listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  try {
    // ticketing = custerId, config in infra/nats-depl
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("Nats connection closed");
      // stop the program as nats client disconnected, it can be disconnected by SIGINT, SIGTERM or Nats server
      process.exit();
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received");
      natsWrapper.client.close();
    });
    process.on("SIGTERM", () => {
      console.log("SIGTERM received");
      natsWrapper.client.close();
    });

    // add listener
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongo");
  } catch (e) {
    console.log(`Error connect mongo`, e);
  }

  app.listen(3000, () => {
    console.log("Payment is listening on 3000");
  });
};

start();
