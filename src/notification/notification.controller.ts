import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common"
import { NotificationService } from "./notification.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { Notification, User } from "@prisma/client"

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getNotifications(@CurrentUser() user: User): Promise<Notification[]> {
    return await this.notificationService.getNotifications(user.id)
  }

  @Post()
  async markAsAllReadNotification(@CurrentUser() user: User) {
    return await this.notificationService.markAsAllReadNotification(user.id)
  }

  @Post(":id")
  async markAsReadNotification(@CurrentUser() user: User, @Param("id") id: string) {
    return await this.notificationService.markAsReadNotification(user.id, id)
  }

  @Delete(":id")
  async deleteNotification(@CurrentUser() user: User, @Param("id") id: string) {
    return await this.notificationService.deleteNotification(user.id, id)
  }
}
