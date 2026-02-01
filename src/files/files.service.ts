import { Injectable } from "@nestjs/common"
import { S3Service } from "../s3/s3.service"
import { PrismaService } from "src/prisma/prisma.service"
import { User } from "@prisma/client"

@Injectable()
export class FilesService {
  constructor(
    private s3: S3Service,
    private prisma: PrismaService,
  ) {}

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

  async processFiles(files: Express.Multer.File[], user: User) {
    return await Promise.all(
      files.map(async (file) => {
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDay()
        const fileKey = `${user.id}/documents/${year}-${month}-${day}/${file.originalname}-${crypto.randomUUID()}`
        const s3Data = await this.s3.upload(file, fileKey)

        return {
          key: s3Data.key,
          url: s3Data.url,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        }
      }),
    )
  }

  async deleteMany(keys: string[]) {
    return await this.s3.deleteMany(keys)
  }
}
