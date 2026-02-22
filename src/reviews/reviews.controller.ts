import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import { ReviewsService } from "./reviews.service"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { Review, ROLE, User } from "@prisma/client"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { Role } from "src/user/decorator/role.decorator"
import { RoleGuard } from "src/user/guard/role.guard"
import { CreateReviewDto } from "./dto/create-review.dto"
import { ConsentsRequiredGuard } from "src/consent/guards/consents-required.guard"

@Controller("reviews")
@UseGuards(JwtAuthGuard, ConsentsRequiredGuard)
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  async getReviews(@CurrentUser() user: User): Promise<Review[]> {
    return await this.reviewsService.getReviews(user.id)
  }

  @Post(":targetId")
  @Role(ROLE.PATIENT)
  @UseGuards(RoleGuard)
  async createReview(
    @CurrentUser() user: User,
    @Param("targetId") targetId: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return await this.reviewsService.createReview(user.id, targetId, createReviewDto)
  }
}
