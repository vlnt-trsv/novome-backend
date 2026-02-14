import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MaxLength } from "class-validator"
import { SERVICE_CATEGORY, SPECIALIZATION } from "@prisma/client"

export class CreateServiceDto {
  @ApiProperty({
    example: "Первичная консультация ринопласта",
    description: "Название медицинской услуги",
  })
  @IsString()
  @IsNotEmpty({ message: "Название услуги не может быть пустым" })
  @MaxLength(255)
  readonly title: string

  @ApiPropertyOptional({
    example: "Включает осмотр, сбор анамнеза и 3D-моделирование носа",
    description: "Подробное описание услуги",
  })
  @IsOptional()
  @IsString()
  readonly description?: string

  @ApiProperty({
    enum: SPECIALIZATION,
    example: SPECIALIZATION.RHINOPLASTY,
    description: "Узкая специализация услуги",
  })
  @IsEnum(SPECIALIZATION, { message: "Некорректная специализация" })
  readonly specialization: SPECIALIZATION

  @ApiProperty({
    enum: SERVICE_CATEGORY,
    example: SERVICE_CATEGORY.CONSULTATION,
    description: "Категория услуги для фильтрации в каталоге",
  })
  @IsEnum(SERVICE_CATEGORY, { message: "Некорректная категория" })
  readonly category: SERVICE_CATEGORY

  @ApiPropertyOptional({
    example: 5000,
    description: "Стоимость услуги (может быть не указана, если цена договорная)",
  })
  @IsOptional()
  @IsNumber({}, { message: "Цена должна быть числом" })
  @Min(0)
  readonly price?: number
}
