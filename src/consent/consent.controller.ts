import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common"
import { ConsentService } from "./consent.service"
import { AUTH_TYPE, Consent, User, UserConsent } from "@prisma/client"
import { CreateConsentDto } from "./dto/create-consent.dto"
import { TypeGuard } from "src/auth/guards/type.guard"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { Type } from "src/auth/decorators/type.decorator"
import { UpdateConsentDto } from "./dto/update-consent.dto"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { Request } from "express"

@Controller("consents")
export class ConsentController {
  constructor(private consentService: ConsentService) {}

  @Get()
  async getConsents(): Promise<Consent[]> {
    return await this.consentService.getConsents()
  }

  @Post("sign")
  @UseGuards(JwtAuthGuard)
  async signConsents(
    @CurrentUser() user: User,
    @Body("consentIds") consentIds: string[],
    @Req() req: Request,
  ) {
    return await this.consentService.signConsents(consentIds, user.id, req)
  }

  @Post(":id/revoke")
  @UseGuards(JwtAuthGuard)
  async revokeConsent(@CurrentUser() user: User, @Param("id") id: string): Promise<UserConsent> {
    return await this.consentService.revokeConsent(id, user.id)
  }

  @Post()
  @Type(AUTH_TYPE.STAFF)
  @UseGuards(JwtAuthGuard, TypeGuard)
  async createConsent(@Body() createConsentDto: CreateConsentDto): Promise<Consent> {
    return await this.consentService.createConsent(createConsentDto)
  }

  @Post(":id")
  @Type(AUTH_TYPE.STAFF)
  @UseGuards(JwtAuthGuard, TypeGuard)
  async publishConsent(@Param("id") id: string): Promise<Consent> {
    return await this.consentService.publishConsent(id)
  }

  @Patch(":id")
  @Type(AUTH_TYPE.STAFF)
  @UseGuards(JwtAuthGuard, TypeGuard)
  async editConsent(
    @Param("id") id: string,
    @Body() updateConsentDto: UpdateConsentDto,
  ): Promise<Consent> {
    return await this.consentService.editConsent(id, updateConsentDto)
  }
}
