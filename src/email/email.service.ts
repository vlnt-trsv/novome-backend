import { Injectable } from "@nestjs/common"
import nodemailer from "nodemailer"

@Injectable()
export class EmailService {
  async sendConfirmationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
    // TODO: (SendGrid, Mailgun, AWS SES, или свой SMTP)
    // const smtpServerEmail = await () => {}
    const url = `${process.env.API_URL}/auth/confirm?email=${email}&token=${token}`

    const nodemailerEmail = await transporter.sendMail({
      from: `"Модерация Novome" ${process.env.EMAIL_USER}`,
      to: email,
      subject: "Подтверждение почты",
      html: `<b>Ваша ссылка для подтверждения почты \n${url}</b>`,
    })
    return process.env.IS_DEV && nodemailerEmail
  }
}
