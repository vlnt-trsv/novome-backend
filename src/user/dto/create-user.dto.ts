import { ApiProperty } from "@nestjs/swagger"
import { ROLE } from "@prisma/client"
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MinLength,
} from "class-validator"
import { PASSWORD_MIN_LENGTH } from "src/common/constants/auth.constants"

export class CreateUserDto {
  @ApiProperty({ example: "patient", description: "Роль пользователя", enum: ROLE })
  @IsEnum(ROLE)
  readonly role: ROLE

  @ApiProperty({ example: "Павел Павлов Павлович", description: "ФИО" })
  @IsNotEmpty()
  readonly fullName: string

  @ApiProperty({ example: "user@emai.ru", description: "Почта пользователя" })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @ApiProperty({ example: "79134445566", description: "Телефон пользователя" })
  @IsOptional()
  readonly phone?: string

  @ApiProperty({ example: "123abc", description: "Пароль пользователя (no hash)" })
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH, { message: "Пароль слишком короткий" })
  readonly password: string

  @ApiProperty({
    example: ["550e8400-e29b-41d4-a716-446655440000"],
    description: "Массив ID принятых политик и соглашений",
    type: [String],
  })
  @IsArray()
  @IsUUID("4", { each: true })
  @IsNotEmpty({ message: "Необходимо принять обязательные соглашения" })
  readonly acceptedConsentIds: string[]
}
