import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import cookieParser from "cookie-parser"
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface"

const PORT = process.env.PORT ?? 5000
const PREFIX = "api/v1"

const cors: CorsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
}

async function start() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix(PREFIX)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors(cors)
  app.use(cookieParser())

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
