import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, MinLength } from "class-validator"
import { PASSWORD_MIN_LENGTH } from "src/common/constants/auth.constants"

export class CreateStaffDto {
  @ApiProperty({ example: "Павел Павлов Павлович", description: "ФИО" })
  @IsNotEmpty()
  readonly fullName: string

  @ApiProperty({ example: "user@emai.ru", description: "Почта модератора" })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @ApiProperty({ example: "123abc", description: "Пароль модератора (no hash)" })
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH, { message: "Пароль слишком короткий" })
  readonly password: string
}
