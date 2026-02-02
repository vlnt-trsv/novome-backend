import { ApiProperty } from "@nestjs/swagger"
import { GENDER } from "@prisma/client"
import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from "class-validator"

export class PatientDto {
  @ApiProperty({
    example: "1990-05-20T00:00:00Z",
    description: "Дата рождения пациента в формате ISO 8601",
    required: false,
  })
  @IsOptional()
  @IsDateString({ strict: true })
  birthdate?: string

  @ApiProperty({ example: "MALE", description: "Пол пацинта", enum: GENDER, required: false })
  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER

  @ApiProperty({
    example: "Ранее проводилась ринопластика в 2015 году. Противопоказаний к общему наркозу нет.",
    description: "Дополнительные медицинские заметки и история операций",
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly medicalNotes?: string

  @ApiProperty({
    example: "A+",
    description: "Группа крови и резус-фактор",
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly bloodType?: string

  @ApiProperty({
    example: ["Пенициллин", "Пыльца"],
    description: "Список аллергических реакций",
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly allergies?: string[]

  @ApiProperty({
    example: "Сахарный диабет 2 типа в стадии компенсации.",
    description: "Хронические заболевания пациента",
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly chronicDiseases?: string
}
