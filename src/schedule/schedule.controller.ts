import { Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { ScheduleService } from "./schedule.service"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { User } from "@prisma/client"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"

@Controller("schedules")
// @UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get(":id")
  async getSchedules(@Param("id") targetId: string, @Query("date") date: Date) {
    return await this.scheduleService.getSchedules(targetId, date)
  }
}
