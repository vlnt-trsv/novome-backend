import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { ModerationService } from "./moderation.service"
import {
  Review,
  User,
  Ticket,
  REVIEW_STATUS,
  Staff,
  TICKET_STATUS,
  TicketMessage,
  MODERATION_STATUS,
  AUTH_TYPE,
} from "@prisma/client"
import { CurrentStaff } from "src/common/decorators/current-staff.decorator"
import { ReplyTicketDto } from "src/support/dto/reply-ticket.dto"
import { Type } from "src/auth/decorators/type.decorator"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { TypeGuard } from "src/auth/guards/type.guard"

@Controller("moderation")
@Type(AUTH_TYPE.STAFF)
@UseGuards(JwtAuthGuard, TypeGuard)
export class ModerationController {
  constructor(private moderationService: ModerationService) {}

  @Get("tickets")
  async getTickets(): Promise<Ticket[]> {
    return await this.moderationService.getTickets()
  }

  @Get("reviews")
  async getReviews(): Promise<Review[]> {
    return await this.moderationService.getReviews()
  }

  @Get("users")
  async getUsers(): Promise<User[]> {
    return await this.moderationService.getUsers()
  }

  @Post("users/:userId")
  async changeUserStatus(
    @Param("userId") userId: string,
    @Query("status") status: MODERATION_STATUS,
    @Body("comment") comment?: string,
  ) {
    return await this.moderationService.changeUserStatus(userId, status, comment)
  }

  @Post("tickets/:id/reply")
  async replyTicket(
    @CurrentStaff() staff: Staff,
    @Param("id") id: string,
    @Body() replyTicketDto: ReplyTicketDto,
  ): Promise<TicketMessage> {
    return await this.moderationService.replyTicket(staff.id, id, replyTicketDto)
  }

  @Post("tickets/:ticketId")
  async changeTicketStatus(
    @CurrentStaff() staff: Staff,
    @Param("ticketId") id: string,
    @Query("status") status: TICKET_STATUS,
  ): Promise<Ticket> {
    return await this.moderationService.changeTicketStatus(staff.id, id, status)
  }

  @Post("review/:reviewId")
  async changeReviewStatus(
    @CurrentStaff() staff: Staff,
    @Param("reviewId") reviewId: string,
    @Query("status") status: REVIEW_STATUS,
  ) {
    return await this.moderationService.changeReviewStatus(staff.id, reviewId, status)
  }
}
