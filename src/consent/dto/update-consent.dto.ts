import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateConsentDto {
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
