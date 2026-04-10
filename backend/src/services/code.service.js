import { Code } from "../models/Code.model.js";
import nodemailer from "nodemailer";

export async function createCode({ email, code }) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "13746ff63f1425",
      pass: "366d68f660f0c4",
    },
  });

  try {
    await transporter.sendMail({
      from: "test@test.com",
      to: email,
      subject: "Test OTP",
      text: `Ton code est ${code}`,
    }).then((result) => {
      Code.create({
          email,
          code,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });
    })
  } catch (error) {
    console.error("Erreur envoi email:", error);
    throw new Error("Échec de l'envoi de l'email");
  }
}

export async function verifyCode({ email, code }) {
  return Code.findOne({ email: email, code: code });
}
