import {
  DeleteObjectCommand,
  GetObjectCommand,
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
        accessKeyId: this.configService.get<string>("S3_ACCESS_KEY") ?? "",
        secretAccessKey: this.configService.get<string>("S3_SECRET_KEY") ?? "",
      },
    })
  }

  async download(key: string) {
    const bucketName = this.configService.get<string>("S3_BUCKET_NAME")
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
    return await this._s3Client.send(command)
  }

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
}
