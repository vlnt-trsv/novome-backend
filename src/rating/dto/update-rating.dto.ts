import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, Min, Max } from "class-validator"

export class UpdateRatingDto {
  @ApiProperty({
    description: "Значение рейтинга (от 0.5 до 5.0)",
    example: 4.5,
    minimum: 0.5,
    maximum: 5.0,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  @Max(5.0)
  readonly value: number
}
