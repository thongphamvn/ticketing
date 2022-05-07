import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@thongphamvn/ticketing-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
