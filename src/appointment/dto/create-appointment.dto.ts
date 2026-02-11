import { ApiProperty } from "@nestjs/swagger"
import { IsUUID, IsString, IsOptional, MaxLength } from "class-validator"

export class CreateAppointmentDto {
  @ApiProperty({
    description: "ID врача, к которому идет запись",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID()
  readonly doctorId: string

  @ApiProperty({
    description: "ID конкретного временного слота",
    example: "660f9511-f30c-52e5-b827-557766551111",
  })
  @IsUUID()
  readonly timeSlotId: string

  @ApiProperty({
    description: "Причина визита или краткое описание жалоб",
    example: "Болит колено после бега",
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  readonly reason?: string
}
