import { IsOptional, IsInt, Min, IsString, IsEnum } from "class-validator"
import { Type } from "class-transformer"
import { ROLE } from "@prisma/client"

export class FindUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0

  @IsOptional()
  @IsEnum(ROLE)
  role?: ROLE

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 20

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(["asc", "desc"])
  sortBy?: "asc" | "desc" = "desc"

  @IsOptional()
  @IsString()
  orderBy?: "createdAt" | "fullName" | "email" = "createdAt"
}
