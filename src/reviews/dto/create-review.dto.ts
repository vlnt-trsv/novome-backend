import { ApiProperty, PickType } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"
import { UpdateRatingDto } from "src/rating/dto/update-rating.dto"

export class CreateReviewDto extends PickType(UpdateRatingDto, ["value"] as const) {
  @ApiProperty({
    example: "Отличный специалист, очень помог!",
    description: "Текст отзыва",
  })
  @IsString()
  @IsNotEmpty()
  readonly text: string
}
