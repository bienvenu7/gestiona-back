"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const logger_1 = require("../utils/logger");
// Charger les variables d'environnement
(0, dotenv_1.config)();
/**
 * Validation et exportation des variables d'environnement
 */
class Environment {
    constructor() {
        this.config = this.validateEnv();
    }
    validateEnv() {
        const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
        const missing = required.filter(key => !process.env[key]);
        if (missing.length > 0) {
            logger_1.logger.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
            process.exit(1);
        }
        return {
            // Application
            NODE_ENV: process.env.NODE_ENV || 'development',
            PORT: parseInt(process.env.PORT || '3000', 10),
            // Database
            DATABASE_URL: process.env.DATABASE_URL,
            // JWT
            JWT_SECRET: process.env.JWT_SECRET,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
            JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
            JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
            // Email
            SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
            SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
            SMTP_USER: process.env.SMTP_USER || '',
            SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
            EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@stocksaas.com',
            MAIL_RU_APP: process.env.MAIL_RU_APP || '',
            // App Settings
            LOG_TO_FILE: process.env.LOG_TO_FILE === 'true',
            RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
            RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
        };
    }
    get() {
        return this.config;
    }
    isDevelopment() {
        return this.config.NODE_ENV === 'development';
    }
    isProduction() {
        return this.config.NODE_ENV === 'production';
    }
    isTest() {
        return this.config.NODE_ENV === 'test';
    }
}
exports.env = new Environment();
exports.default = exports.env.get();
//# sourceMappingURL=env.config.js.map