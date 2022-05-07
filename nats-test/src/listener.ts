import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import {
  TicketCreatedListener,
  TicketUpdatedListener,
} from "./event/ticket-listener";

console.clear();

const stan = nats.connect(`ticketing`, randomBytes(5).toString("hex"), {
  url: `http://localhost:4222`,
});

stan.on("connect", () => {
  console.log(`Listener connected to nats`);

  stan.on("close", () => {
    console.log("Nats connection closed");
    process.exit(1);
  });

  new TicketCreatedListener(stan).listen();
  new TicketUpdatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
