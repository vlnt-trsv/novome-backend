import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsOptional, IsString, IsInt, Min, Max } from "class-validator"

export class UpdateScheduleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  readonly isAvailable?: boolean

  @ApiProperty({ example: "08:00", required: false })
  @IsOptional()
  @IsString()
  readonly startAt?: string

  @ApiProperty({ example: "17:00", required: false })
  @IsOptional()
  @IsString()
  readonly endAt?: string

  @ApiProperty({ default: 30, required: false })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(120)
  readonly slotDuration?: number
}
