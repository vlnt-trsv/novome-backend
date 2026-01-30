import { SetMetadata } from "@nestjs/common"

export const Type = (...types: string[]) => SetMetadata("type", types)
