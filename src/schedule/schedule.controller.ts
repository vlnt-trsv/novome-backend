import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { ScheduleService } from "./schedule.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { Break, ROLE, User, WorkRule } from "@prisma/client"
import { CreateWorkRuleDto } from "./dto/create-work-rule.dto"
import { Role } from "src/user/decorator/role.decorator"
import { RoleGuard } from "src/user/guard/role.guard"
import { CreateBreakDto } from "./dto/create-break.dto"

@Controller("schedules")
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get(":id")
  async getSchedules(@Param("id") targetId: string, @Query("date") date: Date) {
    return await this.scheduleService.getSchedules(targetId, date)
  }

  @Post("work-rule")
  @Role(ROLE.DOCTOR)
  @UseGuards(RoleGuard)
  async createWorkRule(
    @CurrentUser() user: User,
    @Body() createWorkRuleDto: CreateWorkRuleDto,
  ): Promise<WorkRule> {
    return await this.scheduleService.createWorkRule(user.id, createWorkRuleDto)
  }

  @Post("break")
  @Role(ROLE.DOCTOR)
  @UseGuards(RoleGuard)
  async createBreak(
    @CurrentUser() user: User,
    @Body() createBreakDto: CreateBreakDto,
  ): Promise<Break> {
    return await this.scheduleService.createBreak(user.id, createBreakDto)
  }

  @Post(":id")
  @Role(ROLE.DOCTOR)
  @UseGuards(RoleGuard)
  async updateSchedule(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("isAvailable") isAvailable: boolean,
  ) {
    return await this.scheduleService.updateSchedule(user.id, id, isAvailable)
  }
}
