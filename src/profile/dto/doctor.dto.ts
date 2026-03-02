import { ApiProperty } from "@nestjs/swagger"
import { GENDER, SPECIALIZATION } from "@prisma/client"
import { Type } from "class-transformer"
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  // MinLength,
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
  @IsString()
  license: string

  @ApiProperty({ example: "Биография" })
  @IsString()
  bio?: string

  @ApiProperty({
    example: "RHINOPLASTY",
    description: "Специализация",
    enum: SPECIALIZATION,
    isArray: true,
  })
  @IsArray()
  @IsEnum(SPECIALIZATION, { each: true })
  @Type(() => String)
  specializations: SPECIALIZATION[]

  @ApiProperty({ example: 5, description: "Опыт работы (лет)" })
  @IsNumber()
  @Type(() => Number)
  // @MinLength(0)
  experience: number

  @ApiProperty({ example: "МГУ, медицинский факультет", description: "Образование" })
  @IsString()
  education: string

  @ApiProperty({
    example: "Клиника №1 или Частная практика",
    description: "Место работы",
    required: false,
  })
  @IsString()
  workplace?: string

  @ApiProperty({ example: "1234567890", description: "ИНН" })
  @IsString()
  @Length(10, 12)
  inn: string
}
