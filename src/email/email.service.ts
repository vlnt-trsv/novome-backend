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
      subject: "Подтверждение регистрации в Novome",
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2>Здравствуйте!</h2>
          <p>Благодарим за регистрацию в сервисе Novome.</p>
          <p>Чтобы подтвердить адрес электронной почты и завершить регистрацию, пожалуйста, перейдите по ссылке:</p>
          <p style="margin: 20px 0;">
            <a href="${url}" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; rounded: 5px;">
              Подтвердить почту
            </a>
          </p>
          <p style="font-size: 12px; color: #666;">
            Или скопируйте ссылку в браузер: <br>
            ${url}
          </p>
          ${this._footer}
        </div>
      `,
    })
  }

  async sendRecoveryEmail(email: string, token: string): Promise<SentMessageInfo> {
    const url = `${process.env.API_URL}/auth/reset-password?email=${email}&token=${token}`

    return await this._transporter.sendMail({
      from: `"Модерация Novome" ${process.env.EMAIL_USER}`,
      to: email,
      subject: "Восстановление пароля в Novome",
      html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <h2>Восстановление доступа</h2>
        <p>Мы получили запрос на сброс пароля для вашей учетной записи.</p>
        <p>Для создания нового пароля нажмите на кнопку ниже:</p>
        <p style="margin: 20px 0;">
          <a href="${url}" style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; rounded: 5px;">
            Сбросить пароль
          </a>
        </p>
        ${this._footer}
      </div>
    `,
    })
  }

  private readonly _footer = `
    <br><br>
    <hr style="border: none; border-top: 1px solid #eee;" />
    <p style="color: #999; font-size: 12px;">
      Это автоматическое уведомление от сервиса Novome. <br>
      Если вы не запрашивали это письмо, просто проигнорируйте его.
    </p>
  `
}
