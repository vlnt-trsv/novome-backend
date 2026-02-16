import { Injectable } from "@nestjs/common"
import { Notification } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string): Promise<Notification[]> {
    return await this.prisma.notification.findMany({ where: { userId } })
  }

  async markAsAllReadNotification(userId: string) {
    return await this.prisma.notification.updateMany({ where: { userId }, data: { isRead: true } })
  }

  async markAsReadNotification(userId: string, id: string) {
    return await this.prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
      select: { id: true, isRead: true },
    })
  }

  async deleteNotification(userId: string, id: string) {
    return await this.prisma.notification.delete({ where: { id, userId }, select: { id: true } })
  }
}
