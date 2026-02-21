import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common"
import { ScheduleService } from "./schedule.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { Role } from "src/user/decorator/role.decorator"
import { ROLE } from "@prisma/client"
import { RoleGuard } from "src/user/guard/role.guard"

@Controller("schedules")
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get(":id")
  @Role(ROLE.DOCTOR, ROLE.CLINIC)
  @UseGuards(RoleGuard)
  async getSchedules(@Param("id") targetId: string, @Query("date") date: Date) {
    return await this.scheduleService.getSchedules(targetId, date)
  }
}
