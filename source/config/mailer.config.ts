import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';
// 🔥 OBLIGATOIRE
// dns.setDefaultResultOrder('ipv4first');

export async function sendHash(hash: string, email: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.hosting.reg.ru',
      port: 465, // Port sécurisé (SSL)
      secure: true, // true pour 465, false pour 587 (TLS)
      auth: {
        user: 'noreply@afrue.com',
        pass: 'cN1eS3bQ1gyK7sD3',
      },
      tls: {
        // 🔥 CRITIQUE POUR REG.RU
        servername: 'mail.hosting.reg.ru',
        rejectUnauthorized: false,
        minVersion: 'TLSv1',
      },
      connectionTimeout: 20_000,
      greetingTimeout: 20_000,
      socketTimeout: 20_000,
      logger: true,
    });

    // Send email
    await transporter.sendMail({
      from: 'noreply@afrue.com',
      to: email,
      subject: 'En attente de validation',
      html: `Bonjour!<br/>le code de validation est : <strong>${hash}</strong>`,
    });
    logger.info(
      `un email avec un code de confirmation a été envvoyé au: ${email}`
    );
    return 'Success';
  } catch (error) {
    logger.error("Une erreur s'est produite", error);
    return 'failed';
  }
}
