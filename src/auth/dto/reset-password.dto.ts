import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength, NotEquals } from "class-validator"
import { PASSWORD_MIN_LENGTH } from "src/common/constants/auth.constants"

export class ResetPasswordDto {
  @ApiProperty({ example: "example@mail.ru", description: "Почта пользователя" })
  @IsNotEmpty({ message: "Почта не может быть пустой" })
  @IsEmail()
  email: string

  @ApiProperty({ description: "Токен для смены пароля" })
  @IsNotEmpty({ message: "Токен не может быть пустым" })
  token: string

  @ApiProperty({ example: "123abcdef", description: "Новый пароль пользователя" })
  @IsString({ message: "Новый пароль должен быть строкой" })
  @MinLength(PASSWORD_MIN_LENGTH, { message: "Новый пароль должен быть не менее 8 символов" })
  @NotEquals("oldPassword", { message: "Новый пароль не должен совпадать со старым" })
  @IsNotEmpty({ message: "Новый пароль не может быть пустым" })
  newPassword: string
}
