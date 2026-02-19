import { Injectable } from "@nestjs/common"
import { SPECIALIZATION } from "@prisma/client"
import { SPECIALIZATION_CONST } from "src/common/constants/doctor.constants"
import { SERVICE_CATEGORY_CONST } from "src/common/constants/service.constants"
import { STATUS_CONST } from "src/common/constants/status.constants"

@Injectable()
export class ResourcesService {
  getSpecializations() {
    return Object.entries(SPECIALIZATION_CONST).flatMap(([groupKey, group]) =>
      Object.entries(group.items).map(([spec, info]) => ({
        groupKey,
        groupName: group.name,
        specialization: spec as SPECIALIZATION,
        ...info,
      })),
    )
  }

  getServicesCategory() {
    return Object.entries(SERVICE_CATEGORY_CONST).flatMap(([key, item]) => ({
      key,
      name: item.name,
      description: item.description,
    }))
  }

  getStatuses() {
    return Object.entries(STATUS_CONST).flatMap(([groupKey, group]) =>
      Object.entries(group.items).map(([statusKey, info]) => ({
        groupKey,
        groupName: statusKey,
        ...info,
      })),
    )
  }
}
