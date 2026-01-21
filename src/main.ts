import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

const PORT = process.env.PORT ?? 5000

async function start() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle("REST API V1")
    .setDescription("Документация к REST API V1")
    .setVersion("1.0.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("/api/docs", app, document)

  await app.listen(PORT, () => {
    console.log("Сервер запущен", PORT)
  })
}
void start()
