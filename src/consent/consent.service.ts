import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Consent, Prisma } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateConsentDto } from "./dto/create-consent.dto"
import { UpdateConsentDto } from "./dto/update-consent.dto"
import { Request } from "express"

@Injectable()
export class ConsentService {
  constructor(private prisma: PrismaService) {}

  async getConsents(): Promise<Consent[]> {
    return await this.prisma.consent.findMany({
      where: { isPublished: true },
      distinct: ["type"],
      orderBy: { createdAt: "desc" },
    })
  }

  async createConsent(createConsentDto: CreateConsentDto): Promise<Consent> {
    const consents = await this.prisma.consent.findMany()
    for (const consent of consents) {
      if (
        consent.type === createConsentDto.type &&
        Number(consent.version) === Number(createConsentDto.version)
      ) {
        throw new HttpException("Версия новой политики должна быть старше", HttpStatus.BAD_REQUEST)
      }
      if (
        consent.type === createConsentDto.type &&
        Number(consent.version) < Number(createConsentDto.version)
      ) {
        await this.prisma.consent.update({
          where: { id: consent.id },
          data: { isPublished: false, isRequired: false },
        })
      }
    }
    return await this.prisma.consent.create({ data: createConsentDto })
  }

  async publishConsent(id: string): Promise<Consent> {
    return await this.prisma.consent.update({ where: { id }, data: { isPublished: true } })
  }

  async editConsent(id: string, updateConsentDto: UpdateConsentDto): Promise<Consent> {
    const consent = await this.prisma.consent.findUnique({
      where: { id },
      select: { isPublished: true },
    })
    if (consent?.isPublished)
      throw new HttpException("Политика уже опубликована", HttpStatus.BAD_REQUEST)
    return await this.prisma.consent.update({ where: { id }, data: updateConsentDto })
  }

  async signConsents(
    consentIds: string[],
    userId: string,
    req: Request,
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const prisma = tx ?? this.prisma
    const ipAddress = req.ip
    const userAgent = req.headers["user-agent"]
    return await prisma.userConsent.createMany({
      data: consentIds.map((id) => ({ consentId: id, userId, ipAddress, userAgent })),
    })
  }
}
