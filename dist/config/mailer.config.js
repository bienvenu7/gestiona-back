"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHash = sendHash;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../utils/logger");
// 🔥 OBLIGATOIRE
// dns.setDefaultResultOrder('ipv4first');
async function sendHash(hash, email) {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: 'mail.hosting.reg.ru',
            port: 587, // <-- Changed from 465
            secure: false, // true pour 465, false pour 587 (TLS)
            auth: {
                user: 'noreply@afrue.com',
                pass: '5768876587657',
            },
            tls: {
                // 🔥 CRITIQUE POUR REG.RU
                servername: 'mail.hosting.reg.ru',
                rejectUnauthorized: false,
                minVersion: 'TLSv1',
            },
            connectionTimeout: 20000,
            greetingTimeout: 20000,
            socketTimeout: 20000,
            debug: true, // Add this line
            logger: true,
        });
        // Send email
        await transporter.sendMail({
            from: 'noreply@afrue.com',
            to: email,
            subject: 'En attente de validation',
            html: `Bonjour!<br/>le code de validation est : <strong>${hash}</strong>`,
        });
        logger_1.logger.info(`un email avec un code de confirmation a été envvoyé au: ${email}`);
        return 'Success';
    }
    catch (error) {
        logger_1.logger.error("Une erreur s'est produite", error);
        return 'failed';
    }
}
//# sourceMappingURL=mailer.config.js.map