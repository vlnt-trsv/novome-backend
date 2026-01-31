/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class S3Service {
  private readonly _s3Client: S3Client
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this._s3Client = new S3Client({
      region: this.configService.get<string>("S3_REGION"),
      endpoint: this.configService.get<string>("S3_ENDPOINT"),
      credentials: {
        accessKeyId: this.configService.get<string>("S3_ACCESS_KEY") || "",
        secretAccessKey: this.configService.get<string>("S3_SECRET_KEY") || "",
      },
    } as any)
  }

  // async get(fileId: string)

  async upload(file: Express.Multer.File, key: string) {
    if (!file) throw new HttpException("Файлы не указан", HttpStatus.BAD_REQUEST)

    const bucketName = this.configService.get<string>("S3_BUCKET_NAME")
    const endpoint = this.configService.get<string>("S3_ENDPOINT")

    const { buffer, mimetype } = file

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype, // (image/jpeg, video/mp4 и т.д.)
    })

    await this._s3Client.send(command)
    return {
      key,
      url: `${endpoint}/${bucketName}/${key}`,
    }
  }

  async delete(key: string) {
    const bucketName = this.configService.get<string>("S3_BUCKET_NAME")
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
    await this._s3Client.send(command)
  }

  async deleteMany(keys: string[]) {
    if (keys.length === 0) return

    const command = new DeleteObjectsCommand({
      Bucket: this.configService.get("S3_BUCKET_NAME"),
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: true,
      },
    })

    return await this._s3Client.send(command)
  }

  // async uploadManyFiles(files: Express.Multer.File[], userId: string) {
  //   const uploadPromises = files.map((file) => this.uploadFile(file, userId))
  //   return await Promise.all(uploadPromises)
  // }
}
