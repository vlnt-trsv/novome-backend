import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common"
import { ConsentService } from "./consent.service"
import { AUTH_TYPE, Consent } from "@prisma/client"
import { CreateConsentDto } from "./dto/create-consent.dto"
import { TypeGuard } from "src/auth/guards/type.guard"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { Type } from "src/auth/decorators/type.decorator"
import { UpdateConsentDto } from "./dto/update-consent.dto"

@Controller("consents")
@Type(AUTH_TYPE.STAFF)
@UseGuards(JwtAuthGuard, TypeGuard)
export class ConsentController {
  constructor(private consentService: ConsentService) {}

  @Get()
  async getConsents(): Promise<Consent[]> {
    return await this.consentService.getConsents()
  }

  @Post()
  async createConsent(@Body() createConsentDto: CreateConsentDto): Promise<Consent> {
    return await this.consentService.createConsent(createConsentDto)
  }

  @Post(":id")
  async publishConsent(@Param("id") id: string): Promise<Consent> {
    return await this.consentService.publishConsent(id)
  }

  @Patch(":id")
  async editConsent(
    @Param("id") id: string,
    @Body() updateConsentDto: UpdateConsentDto,
  ): Promise<Consent> {
    return await this.consentService.editConsent(id, updateConsentDto)
  }
}
