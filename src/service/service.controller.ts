import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common"
import { ServiceService } from "./service.service"
import { Service, User } from "@prisma/client"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { CreateServiceDto } from "./dto/create-service.dto"
import { UpdateServiceDto } from "./dto/update-service.dto"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { ArchiveServiceDto } from "./dto/archive-service.dto"

@Controller("services")
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Get()
  async getServices(): Promise<Service[]> {
    return await this.serviceService.getServices()
  }

  @Post()
  async createService(
    @CurrentUser() user: User,
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    return await this.serviceService.createService(user.id, createServiceDto)
  }

  @Patch(":id")
  async updateService(
    @Param("id") id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return await this.serviceService.updateService(id, updateServiceDto)
  }

  @Delete(":id")
  async archiveService(@Param("id") id: string, @Body() archiveServiceDto: ArchiveServiceDto) {
    return await this.serviceService.archiveService(id, archiveServiceDto)
  }
}
