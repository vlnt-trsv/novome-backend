import { ApiProperty } from "@nestjs/swagger"
import { IsString, Length, Matches } from "class-validator"

export class ClinicDto {
  @ApiProperty({ example: "ООО Клиника", description: "Юридическое название" })
  @IsString()
  legalName: string

  @ApiProperty({ example: "г. Москва, ул. Ленина, д. 1", description: "Юридический адрес" })
  @IsString()
  legalAddress: string

  @ApiProperty({ example: "г. Москва, ул. Ленина, д. 1", description: "Фактический адрес" })
  @IsString()
  actualAddress: string

  @ApiProperty({ example: "12345", description: "Лицензия клиники" })
  @IsString()
  license: string

  @ApiProperty({ example: "Иванов Иван Иванович", description: "ФИО директора" })
  @IsString()
  directorName: string

  @ApiProperty({ example: "Директор", description: "Должность директора" })
  @IsString()
  directorPosition: string

  @ApiProperty({ example: "1234567890", description: "ИНН" })
  @IsString()
  @Length(10, 12)
  inn: string

  @ApiProperty({ example: "1234567890123", description: "ОГРН (13 цифр)" })
  @IsString()
  @Length(13, 13)
  @Matches(/^\d{13}$/, { message: "ОГРН должен содержать только цифры" })
  ogrn: string
}
