import { ApiPropertyOptional } from "@nestjs/swagger"
import { ROLE, SPECIALIZATION } from "@prisma/client"
import { Transform, Type } from "class-transformer"
import { IsOptional, IsString, IsIn, IsInt, Min, Max, IsArray, IsEnum } from "class-validator"

export class CatalogQueryDto {
  @ApiPropertyOptional({
    description: "Кого ищем в каталоге",
    example: "doctor",
  })
  @IsOptional()
  @IsString()
  @IsIn([ROLE.DOCTOR, ROLE.CLINIC])
  readonly role?: ROLE

  @ApiPropertyOptional({
    description: "Поиск по имени или названию",
    example: "Иванов",
  })
  @IsOptional()
  @IsString()
  readonly search?: string

  @ApiPropertyOptional({
    example: "RHINOPLASTY",
    description: "Специализация",
    enum: SPECIALIZATION,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SPECIALIZATION, { each: true })
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  readonly specializations?: SPECIALIZATION[]

  @ApiPropertyOptional({
    description: "Пагинация: пропустить записей",
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly skip?: number = 0

  @ApiPropertyOptional({
    description: "Пагинация: сколько записей вернуть",
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  readonly take?: number = 10
}
