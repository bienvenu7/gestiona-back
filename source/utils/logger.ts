// src/common/utils/logger.ts

import fs from 'fs';
import path from 'path';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private logsDir: string;

  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
    this.ensureLogsDirectory();
  }

  /**
   * Crée le dossier logs s'il n'existe pas
   */
  private ensureLogsDirectory(): void {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Écrit dans un fichier de log
   */
  private writeToFile(filename: string, content: string): void {
    const filepath = path.join(this.logsDir, filename);
    fs.appendFileSync(filepath, content + '\n', 'utf8');
  }

  /**
   * Formate le message de log
   */
  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data })
    };

    return JSON.stringify(entry);
  }

  /**
   * Méthode générique de log
   */
  private log(level: LogLevel, message: string, data?: any): void {
    const formattedMessage = this.formatMessage(level, message, data);
    
    // Console (avec couleurs)
    const colorMap: Record<LogLevel, string> = {
      info: '\x1b[36m',    // Cyan
      warn: '\x1b[33m',    // Jaune
      error: '\x1b[31m',   // Rouge
      debug: '\x1b[35m'    // Magenta
    };
    const reset = '\x1b[0m';
    console.log(`${colorMap[level]}[${level.toUpperCase()}]${reset} ${message}`, data || '');

    // Fichier (seulement en production ou si activé)
    if (process.env.NODE_ENV === 'production' || process.env.LOG_TO_FILE === 'true') {
      const date = new Date().toISOString().split('T')[0];
      
      // Fichier général
      this.writeToFile(`${date}.log`, formattedMessage);
      
      // Fichier spécifique pour les erreurs
      if (level === 'error') {
        this.writeToFile(`${date}-errors.log`, formattedMessage);
      }
    }
  }

  /**
   * Log d'information
   */
  public info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Log d'avertissement
   */
  public warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  /**
   * Log d'erreur
   */
  public error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  /**
   * Log de debug
   */
  public debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data);
    }
  }
}

export const logger = new Logger();