import { Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import { FilesService } from "src/files/files.service"
import { VisualizeAiDto } from "./dto/visualize-ai.dto"
import { PrismaService } from "src/prisma/prisma.service"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class AiService {
  private ROUTER_AI_URL: string
  private ROUTER_AI_KEY: string
  private ROUTER_AI_MODEL: string
  constructor(
    private prisma: PrismaService,
    private fileService: FilesService,
    private configService: ConfigService,
  ) {
    this.ROUTER_AI_URL = this.configService.get<string>("ROUTER_AI_URL")!
    this.ROUTER_AI_KEY = this.configService.get<string>("ROUTER_AI_KEY")!
    this.ROUTER_AI_MODEL = this.configService.get<string>("ROUTER_AI_MODEL")!
  }

  async history(user: User) {
    return await this.fileService.getFiles(user, "AI_RESULT")
  }

  async visualize(user: User, file: Express.Multer.File, visualizeAiDto: VisualizeAiDto) {
    const { id, aiToken } = user
    const { zone, description } = visualizeAiDto

    const currentPrompt = this._getPrompt(zone, description)
    const response = await fetch(`${this.ROUTER_AI_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.ROUTER_AI_KEY}`,
      },
      body: JSON.stringify({
        model: this.ROUTER_AI_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                },
              },
              {
                type: "text",
                text: currentPrompt,
              },
            ],
          },
        ],
        modalities: ["image", "text"],
        max_tokens: 1000,
      }),
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(`Ошибка RouterAI: ${result.error?.message ?? response.statusText}`)
    }

    const message = result.choices?.[0]?.message
    if (!message) throw new Error("Не удалось получить ответ от модели")

    let imageUrl: string | null = null

    if (message.images && Array.isArray(message.images) && message.images.length > 0) {
      const img = message.images[0]
      imageUrl = img.type === "image_url" ? img.image_url?.url : img.image
    }

    if (!imageUrl && message.content) {
      const contents = Array.isArray(message.content) ? message.content : [message.content]
      for (const item of contents) {
        if (typeof item === "object" && item !== null) {
          if (item.type === "image_url") imageUrl = item.image_url?.url
          else if (item.type === "image") imageUrl = item.image
        } else if (typeof item === "string" && item.startsWith("data:image")) {
          imageUrl = item
        }
        if (imageUrl) break
      }
    }

    if (!imageUrl) {
      console.error("Full AI Response:", JSON.stringify(result, null, 2))
      throw new Error("Изображение не найдено в ответе API")
    }

    let buffer: Buffer

    if (imageUrl.startsWith("data:image")) {
      // Если это Base64
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "")
      buffer = Buffer.from(base64Data, "base64")
    } else {
      const imgRes = await fetch(imageUrl)
      const arrayBuffer = await imgRes.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id }, data: { aiToken: { decrement: 1 } } })

      const mockedFile: Express.Multer.File = {
        buffer: buffer,
        fieldname: "photo",
        originalname: `result_${zone}_${Date.now()}.png`,
        encoding: "7bit",
        mimetype: "image/png",
        size: buffer.length,
        destination: "",
        filename: "",
        path: "",
        stream: null as never,
      }

      const savedFile = await this.fileService.uploadFiles([mockedFile], "AI_RESULT", user, tx)

      return {
        message: "Визуализация готова",
        file: savedFile[0],
        tokensLeft: aiToken - 1,
      }
    })
  }

  async delete(user: User, key: string) {
    return await this.fileService.deleteFile(user, key)
  }

  private _getPrompt(zone: string, description: string): string {
    return `
      Вы инструмент для редактирования изображений. Ваша задача - отредактировать предоставленное изображение, изменив ТОЛЬКО область ${zone}, сохранив все остальное без изменений.
      
      Область для изменения: ${zone}
      Тип изменений: ${description}

      КРИТИЧЕСКИ ВАЖНО:
      - Вы ДОЛЖНЫ использовать именно это изображение как основу - не генерируйте новое изображение
      - Сохраните ВСЕ черты лица: глаза, брови, форму лица, текстуру кожи, цвет волос, родинки, морщины - ВСЕ должно остаться идентичным
      - Измените ТОЛЬКО область ${zone} согласно описанию: ${description}
      - Сохраните освещение, фон, композицию и все оригинальные детали
      - Результат должен быть отредактированной версией ЭТОГО изображения, а не новым сгенерированным изображением
      - Полностью сохраните идентичность человека - это тот же человек, только с измененной указанной областью
      - Примените изменения естественно и реалистично.`
  }
}
