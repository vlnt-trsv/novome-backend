import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import { SupportService } from "./support.service"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { Ticket, TicketMessage, User } from "@prisma/client"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { CreateTicketDto } from "./dto/create-ticket.dto"
import { ReplyTicketDto } from "./dto/reply-ticket.dto"
import { ConsentsRequiredGuard } from "src/consent/guards/consents-required.guard"

@Controller("support")
@UseGuards(JwtAuthGuard, ConsentsRequiredGuard)
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Get("tickets")
  async getTickets(@CurrentUser() user: User): Promise<Ticket[]> {
    return await this.supportService.getTickets(user.id)
  }

  @Get("tickets/:id")
  async getTicket(@CurrentUser() user: User, @Param("id") id: string): Promise<Ticket> {
    return await this.supportService.getTicket(user.id, id)
  }

  @Post("tickets")
  async createTicket(
    @CurrentUser() user: User,
    @Body() createTicketDto: CreateTicketDto,
  ): Promise<Ticket> {
    return await this.supportService.createTicket(user.id, createTicketDto)
  }

  @Post("tickets/:id/reply")
  async replyTicket(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() replyTicketDto: ReplyTicketDto,
  ): Promise<TicketMessage> {
    return await this.supportService.replyTicket(user.id, id, replyTicketDto)
  }

  @Post("tickets/:id/close")
  async closeTicket(@CurrentUser() user: User, @Param("id") id: string) {
    return await this.supportService.closeTicket(user.id, id)
  }
}
