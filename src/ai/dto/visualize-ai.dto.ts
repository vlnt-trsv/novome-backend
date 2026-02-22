import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString, IsNotEmpty } from "class-validator"
import { ZONES_CONST } from "src/common/constants/ai.constants"

export class VisualizeAiDto {
  @ApiProperty({
    example: "nose",
    description: "Ключ выбранной зоны из ZONES_CONST",
    enum: Object.keys(ZONES_CONST),
  })
  @IsEnum(Object.keys(ZONES_CONST), {
    message: "Выберите корректную зону (например: nose, lips, eyes)",
  })
  readonly zone: string

  @ApiProperty({
    example: "Хочу убрать горбинку и сделать кончик чуть выше",
    description: "Пожелания пользователя к визуализации",
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string
}
