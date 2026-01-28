import { PassportStrategy } from "@nestjs/passport"
import { AuthService } from "../auth.service"
import { Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import { JwtPayload } from "src/common/types/jwt-payload.interface"
import { ExtractJwt, Strategy } from "passport-jwt"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_KEY + "",
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    return await this.authService.validateUser(payload)
  }
}
