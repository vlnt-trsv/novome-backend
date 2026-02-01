import { HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class AvatarValidationPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}

  transform(avatar: Express.Multer.File) {
    const maxSize = this.configService.get<number>("MAX_AVATAR_SIZE") || 0
    const allowedTypes = this.configService.get<string>("AVATAR_TYPE") || ""
    const typeRegex = new RegExp(allowedTypes)

    if (!avatar) {
      throw new HttpException("Файлы не найдены", HttpStatus.NOT_FOUND)
    }

    if (avatar.size > maxSize)
      throw new HttpException(
        `Файл ${avatar.originalname} слишком большой. Лимит ${maxSize} байт`,
        HttpStatus.BAD_REQUEST,
      )
    if (!typeRegex.test(avatar.mimetype))
      throw new HttpException(
        `Тип файла ${avatar.mimetype} не поддерживается`,
        HttpStatus.BAD_REQUEST,
      )

    return avatar
  }
}
