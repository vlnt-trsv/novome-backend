import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class LoginDto {
  @ApiProperty({ example: "user@emai.ru", description: "Почта пользователя" })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @ApiProperty({ example: "123abc", description: "Пароль пользователя (no hash)" })
  @IsNotEmpty()
  readonly password: string
}
