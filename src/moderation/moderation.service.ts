import { Injectable } from "@nestjs/common"
import {
  MODERATION_STATUS,
  Review,
  REVIEW_STATUS,
  Ticket,
  TICKET_STATUS,
  TicketMessage,
  User,
} from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { ReplyTicketDto } from "src/support/dto/reply-ticket.dto"

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  async getTickets(): Promise<Ticket[]> {
    return await this.prisma.ticket.findMany({ include: { messages: true } })
  }

  async getReviews(): Promise<Review[]> {
    return await this.prisma.review.findMany()
  }

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async replyTicket(
    staffId: string,
    id: string,
    replyTicketDto: ReplyTicketDto,
  ): Promise<TicketMessage> {
    const { text } = replyTicketDto
    return await this.prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findUnique({ where: { id } })
      return await tx.ticketMessage.create({
        data: {
          senderId: staffId,
          type: "STAFF",
          text,
          ticket: { connect: { id: ticket?.id } },
        },
        include: { ticket: true },
      })
    })
  }

  async changeTicketStatus(staffId: string, id: string, status: TICKET_STATUS): Promise<Ticket> {
    const moderation = await this.prisma.moderation.findUniqueOrThrow({
      where: { moderatorId: staffId },
    })
    console.log(moderation)
    return await this.prisma.ticket.update({
      where: { id },
      data: {
        status,
        moderation: { connect: { id: moderation.id } },
      },
      include: { moderation: true },
    })
  }

  async changeUserStatus(userId: string, status: MODERATION_STATUS, comment?: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { status, moderationComment: comment },
    })
  }

  async changeReviewStatus(staffId: string, reviewId: string, status: REVIEW_STATUS) {
    const moderation = await this.prisma.moderation.findUniqueOrThrow({
      where: { moderatorId: staffId },
    })
    return await this.prisma.review.update({
      where: { id: reviewId, status: "PENDING" },
      data: {
        status,
        moderation: { connect: { id: moderation.id } },
      },
      include: { moderation: true },
    })
  }
}
