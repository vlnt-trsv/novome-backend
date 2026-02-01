import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { PatientDto } from "./patient.dto"
import { DoctorDto } from "./doctor.dto"
import { ClinicDto } from "./clinic.dto"
import { OneOf } from "src/common/decorators/one-of.decorator"

@OneOf(["patient", "doctor", "clinic"])
export class CreateProfileDto {
  @ApiProperty({ description: "Данные пациента для создания профиля" })
  @ValidateNested()
  @Type(() => PatientDto)
  readonly patient: PatientDto

  @ApiProperty({ description: "Данные доктора для создания профиля" })
  @ValidateNested()
  @Type(() => DoctorDto)
  readonly doctor: DoctorDto

  @ApiProperty({ description: "Данные клиники для создания профиля" })
  @ValidateNested()
  @Type(() => ClinicDto)
  readonly clinic: ClinicDto
}
