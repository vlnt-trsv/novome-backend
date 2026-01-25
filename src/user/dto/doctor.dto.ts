import { ApiProperty } from "@nestjs/swagger"
import { Document, GENDER, SPECIALIZATION } from "@prisma/client"
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Matches,
  Length,
  IsArray,
} from "class-validator"

export class DoctorDto {
  @ApiProperty({
    example: "2023-11-15T14:30:00Z",
    description: "Дата рождения в формате YYYY-MM-DD T HH:MM:SS Z",
    required: false,
  })
  @IsOptional()
  @IsDateString({ strict: true })
  birthdate?: string

  @ApiProperty({ example: "MALE", description: "Пол", enum: GENDER, required: false })
  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER

  @ApiProperty({ example: "12345", description: "Номер лицензии" })
  @IsOptional()
  @IsString()
  licenseNumber: string

  @ApiProperty({ example: "RHINOPLASTY", description: "Специализация", enum: SPECIALIZATION })
  @IsOptional()
  @IsEnum(SPECIALIZATION)
  specialization: SPECIALIZATION

  @ApiProperty({ example: 5, description: "Опыт работы (лет)" })
  @IsOptional()
  @IsInt()
  @IsNumber()
  @Min(0)
  experience: number

  @ApiProperty({ example: "МГУ, медицинский факультет", description: "Образование" })
  @IsOptional()
  @IsString()
  education: string

  @ApiProperty({ example: "Клиника №1", description: "Место работы", required: false })
  @IsOptional()
  @IsString()
  workplace?: string

  @ApiProperty({ example: "1234567890", description: "ИНН" })
  @IsOptional()
  @IsString()
  @Length(10, 12)
  @Matches(/^\d{13}$/, { message: "ОГРН должен содержать только цифры" })
  inn: string

  @ApiProperty({ description: "Документы", type: [Object] })
  @IsArray()
  @IsOptional()
  documents: Document[]
}
