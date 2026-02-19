import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import { StaffService } from "./staff.service"
import {
  AUTH_TYPE,
  Staff,
  Ticket,
  MODERATION_STATUS,
  REVIEW_STATUS,
  User,
  Review,
} from "@prisma/client"
import { CurrentStaff } from "src/common/decorators/current-staff.decorator"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { CreateStaffDto } from "./dto/create-staff.dto"
import { TypeGuard } from "src/auth/guards/type.guard"
import { Type } from "src/auth/decorators/type.decorator"

@Controller("staffs")
@Type(AUTH_TYPE.STAFF)
@UseGuards(JwtAuthGuard, TypeGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get("me")
  getMe(@CurrentStaff() staff: Staff) {
    return { ...staff }
  }

  @Get("tickets")
  async getTickets(): Promise<Ticket[]> {
    return await this.staffService.getTickets()
  }

  @Get("reviews")
  async getReviews(): Promise<Review[]> {
    return await this.staffService.getReviews()
  }

  @Get("users")
  async getUsers(): Promise<User[]> {
    return await this.staffService.getUsers()
  }

  @Post("staff")
  async createStaff(@Body() createStaffDto: CreateStaffDto): Promise<Staff> {
    return await this.staffService.createStaff(createStaffDto)
  }

  @Post("users/:userId")
  async changeUserStatus(
    @Param("userId") userId: string,
    @Body("status") status: MODERATION_STATUS,
    @Body("comment") comment?: string,
  ) {
    return await this.staffService.changeUserStatus(userId, status, comment)
  }

  @Post("review/:reviewId")
  async changeReviewStatus(
    @Param("reviewId") reviewId: string,
    @Body("status") status: REVIEW_STATUS,
  ) {
    return await this.staffService.changeReviewStatus(reviewId, status)
  }
}
