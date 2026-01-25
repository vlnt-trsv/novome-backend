import { ApiProperty } from "@nestjs/swagger"
import { Document } from "@prisma/client"
import { IsArray, IsOptional, IsString, Length, Matches } from "class-validator"

export class ClinicDto {
  @ApiProperty({ example: "ООО Клиника", description: "Юридическое название" })
  @IsOptional()
  @IsString()
  legalName: string

  @ApiProperty({ example: "г. Москва, ул. Ленина, д. 1", description: "Юридический адрес" })
  @IsOptional()
  @IsString()
  legalAddress: string

  @ApiProperty({ example: "г. Москва, ул. Ленина, д. 1", description: "Фактический адрес" })
  @IsOptional()
  @IsString()
  actualAddress: string

  @ApiProperty({ example: "12345", description: "Лицензия клиники" })
  @IsOptional()
  @IsString()
  clinicLicense: string

  @ApiProperty({ example: "Иванов Иван Иванович", description: "ФИО директора" })
  @IsOptional()
  @IsString()
  directorName: string

  @ApiProperty({ example: "Директор", description: "Должность директора" })
  @IsOptional()
  @IsString()
  directorPosition: string

  @ApiProperty({ example: "1234567890", description: "ИНН" })
  @IsOptional()
  @Length(10, 12)
  @Matches(/^\d{13}$/, { message: "ОГРН должен содержать только цифры" })
  inn: string

  @ApiProperty({ example: "1234567890123", description: "ОГРН (13 цифр)" })
  @IsOptional()
  @IsString()
  @Length(13, 13)
  @Matches(/^\d{13}$/, { message: "ОГРН должен содержать только цифры" })
  orgn: string

  @ApiProperty({ description: "Документы", type: [Object] })
  @IsArray()
  @IsOptional()
  documents: Document[]
}
