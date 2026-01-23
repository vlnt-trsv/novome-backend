import { ApiProperty } from "@nestjs/swagger"
import { ROLE } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator"

export class CreateUserDto {
  @ApiProperty({ example: "patient", description: "Роль пользователя" })
  @IsEnum(ROLE)
  readonly role: string

  @ApiProperty({ example: "Павел Павлов Павлович", description: "ФИО" })
  @IsNotEmpty()
  readonly fullName: string

  @ApiProperty({ example: "user@emai.ru", description: "Почта пользователя" })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @ApiProperty({ example: "79134445566", description: "Телефон пользователя" })
  readonly phone?: string

  @ApiProperty({ example: "123abc", description: "Пароль пользователя (no hash)" })
  @IsNotEmpty()
  readonly password: string
}
