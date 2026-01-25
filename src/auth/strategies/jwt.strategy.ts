import { PassportStrategy } from "@nestjs/passport"
import { AuthService } from "../auth.service"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import { JwtPayload } from "src/common/types/jwt-payload.interface"
import { ExtractJwt, Strategy } from "passport-jwt"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY + "",
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(payload)
    if (!user) {
      throw new HttpException("Некорректный токен", HttpStatus.UNAUTHORIZED)
    }
    return user
  }
}
