import { ApiProperty } from "@nestjs/swagger"
import { RELATIONSHIP_STATUS } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator"

export class InviteDoctorDto {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "ID врача (UUID)",
  })
  @IsUUID()
  @IsNotEmpty()
  readonly doctorId: string

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID клиники (UUID)",
  })
  @IsUUID()
  @IsNotEmpty()
  readonly clinicId: string

  @ApiProperty({
    example: RELATIONSHIP_STATUS.PENDING,
    enum: RELATIONSHIP_STATUS,
    description: "Статус связи",
    required: false,
  })
  @IsEnum(RELATIONSHIP_STATUS)
  @IsOptional()
  readonly status?: RELATIONSHIP_STATUS
}
