declare class Logger {
    private logsDir;
    constructor();
    /**
     * Crée le dossier logs s'il n'existe pas
     */
    private ensureLogsDirectory;
    /**
     * Écrit dans un fichier de log
     */
    private writeToFile;
    /**
     * Formate le message de log
     */
    private formatMessage;
    /**
     * Méthode générique de log
     */
    private log;
    /**
     * Log d'information
     */
    info(message: string, data?: any): void;
    /**
     * Log d'avertissement
     */
    warn(message: string, data?: any): void;
    /**
     * Log d'erreur
     */
    error(message: string, data?: any): void;
    /**
     * Log de debug
     */
    debug(message: string, data?: any): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map