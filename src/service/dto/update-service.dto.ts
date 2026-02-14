import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsNumber, IsOptional, IsString, Min, MaxLength, IsBoolean } from "class-validator"
import { SERVICE_CATEGORY, SPECIALIZATION } from "@prisma/client"

export class UpdateServiceDto {
  @ApiPropertyOptional({
    example: "Первичная консультация ринопласта",
    description: "Название медицинской услуги",
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly title?: string

  @ApiPropertyOptional({
    example: "Включает осмотр, сбор анамнеза и 3D-моделирование носа",
    description: "Подробное описание услуги",
  })
  @IsOptional()
  @IsString()
  readonly description?: string

  @ApiPropertyOptional({
    enum: SPECIALIZATION,
    example: SPECIALIZATION.RHINOPLASTY,
    description: "Узкая специализация услуги",
  })
  @IsOptional()
  @IsEnum(SPECIALIZATION, { message: "Некорректная специализация" })
  readonly specialization?: SPECIALIZATION

  @ApiPropertyOptional({
    enum: SERVICE_CATEGORY,
    example: SERVICE_CATEGORY.CONSULTATION,
    description: "Категория услуги для фильтрации в каталоге",
  })
  @IsOptional()
  @IsEnum(SERVICE_CATEGORY, { message: "Некорректная категория" })
  readonly category?: SERVICE_CATEGORY

  @ApiPropertyOptional({
    example: 7000,
    description: "Стоимость услуги",
  })
  @IsOptional()
  @IsNumber({}, { message: "Цена должна быть числом" })
  @Min(0)
  readonly price?: number

  @ApiPropertyOptional({
    example: true,
    description: "Статус активности услуги",
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean
}
