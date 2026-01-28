import { Injectable } from "@nestjs/common"
import nodemailer, { SentMessageInfo } from "nodemailer"

@Injectable()
export class EmailService {
  private readonly _transporter: nodemailer.Transporter<SentMessageInfo>

  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }
  async sendConfirmationEmail(email: string, token: string): Promise<SentMessageInfo> {
    const url = `${process.env.API_URL}/auth/confirm?email=${email}&token=${token}`

    return await this._transporter.sendMail({
      from: `"Модерация Novome" ${process.env.EMAIL_USER}`,
      to: email,
      subject: "Подтверждение почты",
      html: `<b>Ваша ссылка для подтверждения почты \n${url}</b>`,
    })
  }

  async sendRecoveryEmail(email: string, token: string): Promise<SentMessageInfo> {
    const url = `${process.env.API_URL}/auth/reset-password?email=${email}&token=${token}`

    return await this._transporter.sendMail({
      from: `"Модерация Novome" ${process.env.EMAIL_USER}`,
      to: email,
      subject: "Восстановление доступа",
      html: `<b>Ваша ссылка для восстановления доступа \n${url}</b>`,
    })
  }
}
