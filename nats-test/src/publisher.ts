import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./event/ticket-publisher";

console.clear();
const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

stan.on("connect", async () => {
  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({ id: "123", title: "Concert", price: 100 });
});
