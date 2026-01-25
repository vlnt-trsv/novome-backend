import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsOptional, ValidateNested } from "class-validator"
import { PatientDto } from "./patient.dto"
import { DoctorDto } from "./doctor.dto"
import { ClinicDto } from "./clinic.dto"

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
