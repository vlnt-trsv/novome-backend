/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ApiProperty } from "@nestjs/swagger"
import { CONSENT_TYPE } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"

export class CreateConsentDto {
  @ApiProperty({ example: "TERMS_OF_SERVICE", description: "Тип согласия", enum: CONSENT_TYPE })
  @IsEnum(CONSENT_TYPE)
  readonly type: CONSENT_TYPE

  @ApiProperty({ example: "1.0", description: "Версия политики" })
  @IsString()
  @IsNotEmpty()
  readonly version: string

  @ApiProperty({
    example: "Пользовательское соглашение",
    description: "Заголовок документа",
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string

  @ApiProperty({
    example: "Полный текст документа с <b>разметкой</b>...",
    description: "Текст политики",
  })
  @IsNotEmpty()
  @IsString()
  readonly text: string
}
