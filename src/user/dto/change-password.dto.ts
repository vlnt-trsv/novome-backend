import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength, NotEquals } from "class-validator"
import { PASSWORD_MIN_LENGTH } from "src/common/constants/auth.constants"

export class ChangePasswordDto {
  @ApiProperty({ example: "123abc", description: "Старый пароль пользователя" })
  @IsString({ message: "Старый пароль должен быть строкой" })
  @IsNotEmpty({ message: "Старый пароль не может быть пустым" })
  @MinLength(PASSWORD_MIN_LENGTH, { message: "Старый пароль слишком короткий" })
  oldPassword: string

  @ApiProperty({ example: "123abcdef", description: "Новый пароль пользователя" })
  @IsString({ message: "Новый пароль должен быть строкой" })
  @MinLength(PASSWORD_MIN_LENGTH, { message: "Новый пароль должен быть не менее 8 символов" })
  @NotEquals("oldPassword", { message: "Новый пароль не должен совпадать со старым" })
  @IsNotEmpty({ message: "Новый пароль не может быть пустым" })
  newPassword: string
}
