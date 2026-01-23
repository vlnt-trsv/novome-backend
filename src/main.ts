import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"

const PORT = process.env.PORT ?? 5000
const PREFIX = "api/v1"

async function start() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix(PREFIX)
  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle("REST API V1")
    .setDescription("Документация к REST API V1")
    .setVersion("1.0.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(`${PREFIX}/docs`, app, document)

  await app.listen(PORT, () => {
    console.log("Сервер запущен", PORT)
  })
}
void start()
