import { PassportStrategy } from "@nestjs/passport"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { JwtPayload } from "src/common/types/jwt-payload.interface"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_ACCESS_KEY"),
    })
  }

  async validate(payload: JwtPayload) {
    const auth = await this.prisma.auth.findUnique({
      where: { id: payload.sub },
      include: {
        user: true,
        staff: true,
      },
    })
    if (!auth)
      throw new HttpException("Пользователь не найден или заблокирован", HttpStatus.UNAUTHORIZED)

    if (payload.type === "USER") {
      return { ...auth.user, type: payload.type }
    }
    if (payload.type === "STAFF") {
      return { ...auth.staff, type: payload.type }
    }
  }
}
