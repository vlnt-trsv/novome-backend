import { ApiProperty } from "@nestjs/swagger"
import { BREAK_TYPE } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsDateString } from "class-validator"

export class CreateBreakDto {
  @ApiProperty({
    example: BREAK_TYPE.VACATION,
    enum: BREAK_TYPE,
    description: "Тип отсутствия (отпуск, больничный и т.д.)",
  })
  @IsEnum(BREAK_TYPE)
  @IsNotEmpty()
  readonly type: BREAK_TYPE

  @ApiProperty({
    example: "2026-03-01T00:00:00.000Z",
    description: "Дата и время начала отсутствия",
  })
  @IsDateString()
  @IsNotEmpty()
  readonly startAt: Date

  @ApiProperty({
    example: "2026-03-14T23:59:59.000Z",
    description: "Дата и время окончания отсутствия",
  })
  @IsDateString()
  @IsNotEmpty()
  readonly endAt: Date
}
