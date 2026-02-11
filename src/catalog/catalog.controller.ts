import { Controller, Get, HttpException, HttpStatus, Query, UseGuards } from "@nestjs/common"
import { CatalogService } from "./catalog.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { CatalogQueryDto } from "./dto/catalog.dto"

@Controller("catalog")
// @UseGuards(JwtAuthGuard)
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get()
  async getCatalog(@Query() query: CatalogQueryDto) {
    if (!query.role) throw new HttpException("Query role обязательна", HttpStatus.BAD_REQUEST)
    return await this.catalogService.getCatalog(
      query.role,
      query.search,
      query.skip,
      query.take,
      query.specializations,
    )
  }

  @Get("specializations")
  getSpecializations() {
    return this.catalogService.getSpecializations()
  }
}
