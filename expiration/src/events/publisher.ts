import {
  ExpirationCompletedEvent,
  Publisher,
  Subjects,
} from "@thongphamvn/ticketing-common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
