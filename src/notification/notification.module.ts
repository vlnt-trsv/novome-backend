import { Module } from "@nestjs/common"
import { NotificationService } from "./notification.service"
import { NotificationController } from "./notification.controller"
import { NotificationListener } from "./listeners/appointment-notification.listener"

@Module({
  providers: [NotificationListener, NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
