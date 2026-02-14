import { Controller, Param, Patch, Query, UseGuards } from "@nestjs/common"
import { RatingService } from "./rating.service"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { User } from "@prisma/client"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { UpdateRatingDto } from "./dto/update-rating.dto"

@Controller("ratings")
@UseGuards(JwtAuthGuard)
export class RatingController {
  constructor(private ratignService: RatingService) {}

  @Patch(":targetId")
  async updateRating(
    @CurrentUser() user: User,
    @Param("targetId") targetId: string,
    @Query() query: UpdateRatingDto,
  ) {
    return await this.ratignService.updateRating(user.id, targetId, query)
  }
}
