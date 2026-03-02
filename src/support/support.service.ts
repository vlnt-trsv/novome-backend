import { Injectable } from "@nestjs/common"
import { Ticket, TicketMessage } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateTicketDto } from "./dto/create-ticket.dto"
import { ReplyTicketDto } from "./dto/reply-ticket.dto"

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async getTickets(userId: string): Promise<Ticket[]> {
    return await this.prisma.ticket.findMany({
      where: { userId },
      include: { messages: true },
    })
  }

  async getTicket(userId: string, id: string): Promise<Ticket> {
    return await this.prisma.ticket.findUniqueOrThrow({
      where: { userId, id },
      include: { messages: true },
    })
  }

  async createTicket(userId: string, createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { title, text } = createTicketDto
    return await this.prisma.ticket.create({
      data: {
        userId,
        title,
        messages: {
          create: {
            text,
            senderId: userId,
            type: "USER",
          },
        },
      },
      include: {
        messages: true,
      },
    })
  }

  async replyTicket(
    userId: string,
    id: string,
    replyTicketDto: ReplyTicketDto,
  ): Promise<TicketMessage> {
    const { text } = replyTicketDto
    return await this.prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findUnique({ where: { id } })
      return await tx.ticketMessage.create({
        data: {
          senderId: userId,
          type: "USER",
          text,
          ticket: { connect: { id: ticket?.id } },
        },
        include: { ticket: true },
      })
    })
  }

  async closeTicket(userId: string, id: string) {
    return await this.prisma.ticket.update({ where: { userId, id }, data: { status: "CLOSED" } })
  }
}
