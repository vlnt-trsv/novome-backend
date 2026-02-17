import { Module } from "@nestjs/common"
import { NotificationService } from "./notification.service"
import { NotificationController } from "./notification.controller"
import { AppointmentNotificationListener } from "./listeners/appointment-notification.listener"
import { RelationshipNotificationListener } from "./listeners/relationship-notification.listener"

@Module({
  providers: [
    RelationshipNotificationListener,
    AppointmentNotificationListener,
    NotificationService,
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
