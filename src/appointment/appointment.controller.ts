import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { AppointmentService } from "./appointment.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { APPOINTMENT_STATUS, User } from "@prisma/client"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"

@Controller("appointments")
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(
    private appointmentService: AppointmentService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  async getAppointments(@CurrentUser() user: User) {
    return await this.appointmentService.getAppointments(user)
  }

  @Get(":id")
  async getAppointment(@CurrentUser() user: User, @Param("id") id: string) {
    return await this.appointmentService.getAppointment(user, id)
  }

  @Post()
  async createAppointment(
    @CurrentUser() user: User,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    const appointment = await this.appointmentService.createAppointment(user, createAppointmentDto)
    this.eventEmitter.emit("appointment.status.changed", { userId: user.id, appointment })
    return appointment
  }

  @Post(":id")
  async updateAppointmentStatus(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Query("status") status: APPOINTMENT_STATUS,
  ) {
    const appointment = await this.appointmentService.updateAppointmentStatus(user, id, status)
    this.eventEmitter.emit("appointment.status.changed", { userId: user.id, appointment })
    return appointment
  }
}
