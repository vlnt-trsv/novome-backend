import { Injectable, NotFoundException } from "@nestjs/common"
import { S3Service } from "../s3/s3.service"
import { PrismaService } from "src/prisma/prisma.service"
import { File, FILE_TYPE, Prisma, User } from "@prisma/client"
import { ROLE_CONST } from "src/common/constants/user.constants"

@Injectable()
export class FilesService {
  constructor(
    private s3: S3Service,
    private prisma: PrismaService,
  ) {}

  async getFiles(user: User, type?: FILE_TYPE) {
    const { id, role } = user
    const roleKey = ROLE_CONST[role]
    return await this.prisma.file.findMany({
      where: { [`${roleKey}Id`]: id, type },
    })
  }

  async uploadAvatar(file: Express.Multer.File, user: User) {
    const key = `${user.id}/avatar/${user.id}-avatar`
    const s3Data = await this.s3.upload(file, key, "PUBLIC")

    try {
      return await this.prisma.user.update({
        where: { id: user.id },
        data: { avatar: s3Data.url },
        select: { avatar: true },
      })
    } catch (error) {
      await this.s3.delete(s3Data.key, "PUBLIC")
      throw error
    }
  }

  async uploadFiles(
    files: Express.Multer.File[],
    type: FILE_TYPE,
    user: User,
    tx?: Prisma.TransactionClient,
  ) {
    const { id, role } = user
    const prisma = tx ?? this.prisma
    const uploadedData: File[] = []
    const roleKey = ROLE_CONST[role]

    if (!type) throw new NotFoundException("Тип файла обязателен")
    const folder = (type as string).toLowerCase()

    for (const file of files) {
      const key = this._generateKey(id, folder, file.originalname)
      const s3Data = await this.s3.upload(file, key, "PRIVATE")

      try {
        const dbFile = await prisma.file.create({
          data: {
            originalName: file.originalname,
            mimeType: file.mimetype,
            type: type,
            s3Key: s3Data.key,
            size: file.size,
            url: s3Data.url,
            [`${roleKey}Id`]: id,
          },
        })
        uploadedData.push(dbFile)
      } catch (error) {
        await this.s3.delete(s3Data.key, "PRIVATE")
        throw error
      }
    }
    return uploadedData
  }

  async deleteFile(user: User, key: string) {
    const { id, role } = user
    const roleKey = ROLE_CONST[role]
    return await this.prisma.$transaction(async (tx) => {
      await tx.file.deleteMany({ where: { [`${roleKey}Id`]: id, s3Key: key } })
      return await this.s3.delete(key, "PRIVATE")
    })
  }

  private _generateKey(userId: string, folder: string, fileName: string): string {
    const date = new Date()
    const timestamp = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
    return `${userId}/${folder}/${timestamp}/${crypto.randomUUID()}-${fileName}`
  }
}
