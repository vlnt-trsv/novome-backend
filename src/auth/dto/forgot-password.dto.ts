import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class ForgotPasswordDto {
  @ApiProperty({ example: "example@mail.ru", description: "Почта пользователя" })
  @IsNotEmpty({ message: "Почта не может быть пустой" })
  @IsEmail()
  email: string
}
