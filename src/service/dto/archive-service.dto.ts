import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString, MaxLength } from "class-validator"

export class ArchiveServiceDto {
  @ApiPropertyOptional({
    example: "Услуга более не актуальна в данном филиале",
    description: "Причина архивации услуги",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly reason?: string
}
