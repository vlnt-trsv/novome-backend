/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { Document, GENDER, SPECIALIZATION } from "@prisma/client"
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from "class-validator"

class PatientDto {
  @ApiProperty({ example: "1990-01-15", description: "Дата рождения", required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: string

  @ApiProperty({ example: "MALE", description: "Пол", enum: GENDER, required: false })
  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER
}

class DoctorDto {
  @ApiProperty({ example: "1990-01-15", description: "Дата рождения", required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: string

  @ApiProperty({ example: "MALE", description: "Пол", enum: GENDER, required: false })
  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER

  @ApiProperty({ example: "12345", description: "Номер лицензии" })
  @IsNotEmpty()
  @IsString()
  licenseNumber: string

  @ApiProperty({ example: "RHINOPLASTY", description: "Специализация", enum: SPECIALIZATION })
  @IsNotEmpty()
  @IsEnum(SPECIALIZATION)
  specialization: SPECIALIZATION

  @ApiProperty({ example: 5, description: "Опыт работы (лет)" })
  @IsNotEmpty()
  @IsInt()
  @IsNumber()
  @Min(0)
  experience: number

  @ApiProperty({ example: "МГУ, медицинский факультет", description: "Образование" })
  @IsNotEmpty()
  @IsString()
  education: string

  @ApiProperty({ example: "Клиника №1", description: "Место работы", required: false })
  @IsOptional()
  @IsString()
  workplace?: string

  @ApiProperty({ example: "1234567890", description: "ИНН" })
  @IsNotEmpty()
  @IsString()
  @Length(10, 12)
  @Matches(/^\d{13}$/, { message: "ОГРН должен содержать только цифры" })
  inn: string

  @ApiProperty({ description: "Документы", type: [Object] })
  @IsArray()
  @IsOptional()
  documents: Document[]
}

class ClinicDto {
  @ApiProperty({ example: "ООО Клиника", description: "Юридическое название" })
  @IsNotEmpty()
  @IsString()
  legalName: string

  @ApiProperty({ example: "г. Москва, ул. Ленина, д. 1", description: "Юридический адрес" })
  @IsNotEmpty()
  @IsString()
  legalAddress: string

  @ApiProperty({ example: "г. Москва, ул. Ленина, д. 1", description: "Фактический адрес" })
  @IsNotEmpty()
  @IsString()
  actualAddress: string

  @ApiProperty({ example: "12345", description: "Лицензия клиники" })
  @IsNotEmpty()
  @IsString()
  clinicLicense: string

  @ApiProperty({ example: "Иванов Иван Иванович", description: "ФИО директора" })
  @IsNotEmpty()
  @IsString()
  directorName: string

  @ApiProperty({ example: "Директор", description: "Должность директора" })
  @IsNotEmpty()
  @IsString()
  directorPosition: string

  @ApiProperty({ example: "1234567890", description: "ИНН" })
  @IsNotEmpty()
  @Length(10, 12)
  @Matches(/^\d{13}$/, { message: "ОГРН должен содержать только цифры" })
  inn: string

  @ApiProperty({ example: "1234567890123", description: "ОГРН (13 цифр)" })
  @IsNotEmpty()
  @IsString()
  @Length(13, 13)
  @Matches(/^\d{13}$/, { message: "ОГРН должен содержать только цифры" })
  orgn: string

  @ApiProperty({ description: "Документы", type: [Object] })
  @IsArray()
  @IsOptional()
  documents: Document[]
}

export class CreateProfileDto {
  @ApiProperty({ description: "Данные пациента для создания профиля", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PatientDto)
  readonly patient?: PatientDto

  @ApiProperty({ description: "Данные доктора для создания профиля", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => DoctorDto)
  readonly doctor?: DoctorDto

  @ApiProperty({ description: "Данные клиники для создания профиля", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ClinicDto)
  readonly clinic?: ClinicDto
}
