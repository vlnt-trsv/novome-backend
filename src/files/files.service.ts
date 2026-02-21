import { Injectable, StreamableFile } from "@nestjs/common"
import { S3Service } from "../s3/s3.service"
import { PrismaService } from "src/prisma/prisma.service"
import { File, Prisma, User } from "@prisma/client"
import { Readable } from "node:stream"
import { ROLE_CONST } from "src/common/constants/user.constants"

@Injectable()
export class FilesService {
  constructor(
    private s3: S3Service,
    private prisma: PrismaService,
  ) {}

  async downloadFile(key: string) {
    const response = await this.s3.download(key)

    return new StreamableFile(response.Body as Readable, {
      type: response.ContentType,
    })
  }

  async uploadAvatar(file: Express.Multer.File, user: User) {
    const fileKey = `${user.id}/avatar/${user.id}-avatar`
    const s3Data = await this.s3.upload(file, fileKey)

    try {
      return await this.prisma.user.update({
        where: { id: user.id },
        data: { avatar: s3Data.url },
        select: { avatar: true },
      })
    } catch (error) {
      await this.s3.delete(s3Data.key)
      throw error
    }
  }

  async uploadFiles(files: Express.Multer.File[], user: User, tx?: Prisma.TransactionClient) {
    const prisma = tx ?? this.prisma
    const uploadedData: File[] = []
    const roleKey = ROLE_CONST[user.role]

    for (const file of files) {
      const key = this._generateKey(user.id, "files", file.originalname)
      const s3Data = await this.s3.upload(file, key)

      try {
        const dbFile = await prisma.file.create({
          data: {
            originalName: file.originalname,
            mimeType: file.mimetype,
            s3Key: s3Data.key,
            size: file.size,
            url: s3Data.url,
            [`${roleKey}Id`]: user.id,
          },
        })
        uploadedData.push(dbFile)
      } catch (error) {
        await this.s3.delete(s3Data.key)
        throw error
      }
    }
    return uploadedData
  }

  async deleteFile(key: string) {
    return await this.prisma.$transaction(async (tx) => {
      await tx.file.delete({ where: { s3Key: key } })
      return await this.s3.delete(key)
    })
  }

  private _generateKey(userId: string, folder: string, fileName: string): string {
    const date = new Date()
    const timestamp = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
    return `${userId}/${folder}/${timestamp}/${crypto.randomUUID()}-${fileName}`
  }
}
