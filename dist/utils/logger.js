"use strict";
// src/common/utils/logger.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Logger {
    constructor() {
        this.logsDir = path_1.default.join(process.cwd(), 'logs');
        this.ensureLogsDirectory();
    }
    /**
     * Crée le dossier logs s'il n'existe pas
     */
    ensureLogsDirectory() {
        if (!fs_1.default.existsSync(this.logsDir)) {
            fs_1.default.mkdirSync(this.logsDir, { recursive: true });
        }
    }
    /**
     * Écrit dans un fichier de log
     */
    writeToFile(filename, content) {
        const filepath = path_1.default.join(this.logsDir, filename);
        fs_1.default.appendFileSync(filepath, content + '\n', 'utf8');
    }
    /**
     * Formate le message de log
     */
    formatMessage(level, message, data) {
        const entry = {
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
    log(level, message, data) {
        const formattedMessage = this.formatMessage(level, message, data);
        // Console (avec couleurs)
        const colorMap = {
            info: '\x1b[36m', // Cyan
            warn: '\x1b[33m', // Jaune
            error: '\x1b[31m', // Rouge
            debug: '\x1b[35m' // Magenta
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
    info(message, data) {
        this.log('info', message, data);
    }
    /**
     * Log d'avertissement
     */
    warn(message, data) {
        this.log('warn', message, data);
    }
    /**
     * Log d'erreur
     */
    error(message, data) {
        this.log('error', message, data);
    }
    /**
     * Log de debug
     */
    debug(message, data) {
        if (process.env.NODE_ENV === 'development') {
            this.log('debug', message, data);
        }
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map