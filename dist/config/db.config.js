"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.prismaErrorHandler = prismaErrorHandler;
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const app_error_1 = require("../utils/app.error");
exports.prisma = new client_2.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
function prismaErrorHandler(err, req, res, next) {
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                return next(new app_error_1.AppError('La référence unique a été dupliquée', 409));
            case 'P2025':
                return next(new app_error_1.AppError('Aucune données trouvées', 404));
            default:
                return next(new app_error_1.AppError("Une erreur s'est produite lors de la connection à la database.", 500));
        }
    }
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        return next(new app_error_1.AppError('Query invalide depuis la database.', 400));
    }
    if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        return next(new app_error_1.AppError("Une erreur s'est produite lors de la connection à la database.", 500));
    }
    return next(err); // pass to the next error handler
}
//# sourceMappingURL=db.config.js.map