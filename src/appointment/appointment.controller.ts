import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { AppointmentService } from "./appointment.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { APPOINTMENT_STATUS, User } from "@prisma/client"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"

@Controller("appointments")
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Get()
  async getAppointments(@CurrentUser() user: User) {
    return await this.appointmentService.getAppointments(user)
  }

  @Get(":id")
  async getAppointment(@Param("id") id: string) {
    return await this.appointmentService.getAppointment(id)
  }

  @Post()
  async createAppointment(
    @CurrentUser() user: User,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return await this.appointmentService.createAppointment(user, createAppointmentDto)
  }

  @Post(":id")
  async updateAppointmentStatus(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Query("status") status: APPOINTMENT_STATUS,
  ) {
    return await this.appointmentService.updateAppointmentStatus(user, id, status)
  }
}
