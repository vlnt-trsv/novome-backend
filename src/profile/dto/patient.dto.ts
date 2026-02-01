import { ApiProperty } from "@nestjs/swagger"
import { GENDER } from "@prisma/client"
import { IsDateString, IsEnum, IsOptional } from "class-validator"

export class PatientDto {
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
}
