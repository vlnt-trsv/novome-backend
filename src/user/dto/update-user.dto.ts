import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ClinicDto } from "src/profile/dto/clinic.dto"
import { PatientDto } from "src/profile/dto/patient.dto"
import { DoctorDto } from "src/profile/dto/doctor.dto"

export class UpdateUserDto {
  @ApiProperty({ example: "Петр Петров Петрович", description: "ФИО пользователя" })
  @IsOptional()
  readonly fullName?: string

  @ApiProperty({ example: "petr@example.com", description: "Почта пользователя" })
  @IsOptional()
  readonly email?: string

  @ApiProperty({ example: "+79134445566", description: "Телефон пользователя" })
  @IsOptional()
  readonly phone?: string

  @ApiProperty({ description: "Данные пациента для обновления профиля", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PatientDto)
  readonly patient?: PatientDto

  @ApiProperty({ description: "Данные доктора для обновления профиля", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => DoctorDto)
  readonly doctor?: DoctorDto

  @ApiProperty({ description: "Данные клиники для обновления профиля", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ClinicDto)
  readonly clinic?: ClinicDto
}
