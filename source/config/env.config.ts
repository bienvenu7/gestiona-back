import { config } from 'dotenv';
import { logger } from '../utils/logger';

// Charger les variables d'environnement
config();

interface EnvConfig {
  // Application
  NODE_ENV: string;
  PORT: number;

  // Database
  DATABASE_URL: string;

  // JWT
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;

  // Email
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  EMAIL_FROM: string;
  MAIL_RU_APP: string;

  // App Settings
  LOG_TO_FILE: boolean;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

/**
 * Validation et exportation des variables d'environnement
 */
class Environment {
  private config: EnvConfig;

  constructor() {
    this.config = this.validateEnv();
  }

  private validateEnv(): EnvConfig {
    const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      logger.error(
        `❌ Missing required environment variables: ${missing.join(', ')}`
      );
      process.exit(1);
    }

    return {
      // Application
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: parseInt(process.env.PORT || '3000', 10),

      // Database
      DATABASE_URL: process.env.DATABASE_URL!,

      // JWT
      JWT_SECRET: process.env.JWT_SECRET!,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
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
      RATE_LIMIT_WINDOW_MS: parseInt(
        process.env.RATE_LIMIT_WINDOW_MS || '900000',
        10
      ), // 15 min
      RATE_LIMIT_MAX_REQUESTS: parseInt(
        process.env.RATE_LIMIT_MAX_REQUESTS || '100',
        10
      ),
    };
  }

  public get(): EnvConfig {
    return this.config;
  }

  public isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  public isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  public isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }
}

export const env = new Environment();
export default env.get();
