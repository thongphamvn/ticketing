import { OrderCreatedListener } from "./events/listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
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
  } catch (e) {
    console.log(`Error connect`, e);
  }
};

start();
