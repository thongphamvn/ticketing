import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent, TicketUpdatedEvent } from "./ticket-events";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName = "ticketing";
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  onMessage(data: TicketCreatedEvent["data"], message: Message): void {
    console.log("Event data", data);

    message.ack();
  }
}

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  queueGroupName = "ticketing";
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  onMessage(data: TicketUpdatedEvent["data"], message: Message): void {
    console.log("Event data", data);

    message.ack();
  }
}
