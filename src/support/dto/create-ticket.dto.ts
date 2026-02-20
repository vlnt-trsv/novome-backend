import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator"

export class CreateTicketDto {
  @ApiProperty({
    example: "Не работает доступ к API",
    description: "Заголовок обращения",
  })
  @IsString()
  @IsNotEmpty({ message: "Заголовок не может быть пустым" })
  @MinLength(5, { message: "Заголовок должен быть не короче 5 символов" })
  @MaxLength(255)
  readonly title: string

  @ApiProperty({
    example: "Я пытаюсь авторизоваться, но получаю ошибку 500...",
    description: "Текст первого сообщения в тикете",
  })
  @IsString()
  @IsNotEmpty({ message: "Сообщение не может быть пустым" })
  @MinLength(10, { message: "Опишите проблему подробнее (минимум 10 символов)" })
  readonly text: string
}
