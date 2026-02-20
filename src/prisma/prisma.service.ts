import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { withOptimize } from "@prisma/extension-optimize"
import { Pool } from "pg"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    const connectionString = configService.get<string>("DATABASE_URL")
    const optimizeApiKey = configService.get<string>("OPTIMIZE_API_KEY")

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)

    super({ adapter })

    if (optimizeApiKey) {
      return Object.assign(this, this.$extends(withOptimize({ apiKey: optimizeApiKey })))
    }
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
