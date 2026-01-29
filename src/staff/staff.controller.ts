import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import { StaffService } from "./staff.service"
import { Moderation, Staff, Ticket, USER_STATUS } from "@prisma/client"
import { CurrentStaff } from "src/common/decorators/current-staff.decorator"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { CreateStaffDto } from "./dto/create-staff.dto"
import { AccessGuard } from "src/auth/guards/access.guard"

@Controller("staffs")
@UseGuards(JwtAuthGuard, AccessGuard)
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

  @Get("moderations")
  async getModerations(): Promise<Moderation[]> {
    return await this.staffService.getModerations()
  }

  @Post("staff")
  async createStaff(@Body() createStaffDto: CreateStaffDto): Promise<Staff> {
    return await this.staffService.createStaff(createStaffDto)
  }

  @Post("/moderate/users/:userId")
  async changeUserStatus(@Param("userId") userId: string, @Body("status") status: USER_STATUS) {
    return await this.staffService.changeUserStatus(userId, status)
  }
}
