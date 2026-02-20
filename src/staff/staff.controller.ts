import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { StaffService } from "./staff.service"
import { AUTH_TYPE, Staff } from "@prisma/client"
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

  @Post()
  async createStaff(@Body() createStaffDto: CreateStaffDto): Promise<Staff> {
    return await this.staffService.createStaff(createStaffDto)
  }
}
