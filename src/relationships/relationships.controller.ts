import { Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { RelationshipsService } from "./relationships.service"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { Relationship, RELATIONSHIP_STATUS, ROLE, User } from "@prisma/client"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { Role } from "src/user/decorator/role.decorator"
import { RoleGuard } from "src/user/guard/role.guard"
import { EventEmitter2 } from "@nestjs/event-emitter"

@Controller("relationships")
@UseGuards(JwtAuthGuard)
export class RelationshipsController {
  constructor(
    private relationshipService: RelationshipsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @Role(ROLE.DOCTOR, ROLE.CLINIC)
  @UseGuards(RoleGuard)
  async getRelationships(@CurrentUser() user: User): Promise<Relationship[]> {
    return await this.relationshipService.getRelationships(user.id)
  }

  @Post(":doctorId/invite")
  @Role(ROLE.CLINIC)
  @UseGuards(RoleGuard)
  async inviteDoctor(
    @CurrentUser() user: User,
    @Param("doctorId") doctorId: string,
  ): Promise<Relationship> {
    const relationship = await this.relationshipService.inviteDoctor({
      clinicId: user.id,
      doctorId,
    })
    this.eventEmitter.emit("relationship.status.changed", { userId: doctorId, relationship })
    return relationship
  }

  @Post(":id")
  @Role(ROLE.DOCTOR)
  @UseGuards(RoleGuard)
  async changeStatus(
    @Param("id") id: string,
    @Query("status") status: RELATIONSHIP_STATUS,
  ): Promise<Relationship> {
    const relationship = await this.relationshipService.changeStatus(id, status)
    this.eventEmitter.emit("relationship.status.changed", {
      userId: relationship.clinicId,
      relationship,
    })
    return relationship
  }

  @Delete(":id")
  @Role(ROLE.DOCTOR, ROLE.CLINIC)
  @UseGuards(RoleGuard)
  async archiveRelationship(@Param("id") id: string) {
    const relationship = await this.relationshipService.archiveRelationship(id)
    this.eventEmitter.emit("relationship.status.changed", {
      userId: relationship.doctorId,
      relationship,
    })
    this.eventEmitter.emit("relationship.status.changed", {
      userId: relationship.clinicId,
      relationship,
    })
    return relationship
  }
}
