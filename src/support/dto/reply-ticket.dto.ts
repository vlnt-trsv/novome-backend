import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, MinLength } from "class-validator"

export class ReplyTicketDto {
  @ApiProperty({
    example: "Я пытаюсь авторизоваться, но получаю ошибку 500...",
    description: "Текст первого сообщения в тикете",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  readonly text: string
}
