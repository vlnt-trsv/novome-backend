import { Controller, Get } from "@nestjs/common"
import { ResourcesService } from "./resources.service"

@Controller("resources")
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get("specializations")
  getSpecializations() {
    return this.resourcesService.getSpecializations()
  }

  @Get("services")
  getServicesCategory() {
    return this.resourcesService.getServicesCategory()
  }

  @Get("statuses")
  getStatuses() {
    return this.resourcesService.getStatuses()
  }
}
