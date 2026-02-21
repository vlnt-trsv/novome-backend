import { HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}

  transform(files: Express.Multer.File[]) {
    const maxSize = this.configService.get<number>("MAX_FILE_SIZE") ?? 0
    const allowedTypes = this.configService.get<string>("FILE_TYPE") ?? ""
    const typeRegex = new RegExp(allowedTypes)

    if (!files || files.length === 0) {
      console.log(files)
      throw new HttpException("Файлы не найдены", HttpStatus.NOT_FOUND)
    }

    for (const file of files) {
      if (file.size > maxSize)
        throw new HttpException(
          `Файл ${file.originalname} слишком большой. Лимит ${maxSize} байт`,
          HttpStatus.BAD_REQUEST,
        )
      if (!typeRegex.test(file.mimetype))
        throw new HttpException(
          `Тип файла ${file.mimetype} не поддерживается`,
          HttpStatus.BAD_REQUEST,
        )
    }

    return files
  }
}
