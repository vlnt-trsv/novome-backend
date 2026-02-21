import { Injectable } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { Relationship } from "@prisma/client"
import { RELATIONSHIP_NOTIFICATION_CONST } from "src/common/constants/relationship.constants"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class RelationshipNotificationListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent("relationship.status.changed", { async: true })
  async relationshipStatusChanged(payload: { userId: string; relationship: Relationship }) {
    const { userId, relationship } = payload
    const meta = RELATIONSHIP_NOTIFICATION_CONST[relationship.status]

    return await this.prisma.notification.create({
      data: {
        user: { connect: { id: userId } },
        type: meta.type,
        title: meta.title,
        description: meta.description,
        payload: relationship,
      },
    })
  }
}
