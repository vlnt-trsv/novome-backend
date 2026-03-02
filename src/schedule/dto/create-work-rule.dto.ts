import { ApiProperty } from "@nestjs/swagger"
import { RULE_TYPE } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString, Matches } from "class-validator"

export class CreateWorkRuleDto {
  @ApiProperty({
    example: RULE_TYPE.LUNCH,
    enum: RULE_TYPE,
    description: "Тип правила (в данном случае обеденный перерыв)",
  })
  @IsNotEmpty()
  @IsEnum(RULE_TYPE)
  readonly type: RULE_TYPE

  @ApiProperty({
    example: "13:00",
    description: "Начало обеда (HH:mm)",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Формат времени должен быть HH:mm (например, 13:00)",
  })
  readonly startTime: string

  @ApiProperty({
    example: "14:00",
    description: "Конец обеда (HH:mm)",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Формат времени должен быть HH:mm (например, 14:00)",
  })
  readonly endTime: string
}
