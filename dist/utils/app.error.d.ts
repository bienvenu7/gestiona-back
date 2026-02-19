import { ValidationErrorItem } from '../types/error';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    errors?: ValidationErrorItem[];
    constructor(message: string, statusCode: number, errors?: ValidationErrorItem[]);
}
//# sourceMappingURL=app.error.d.ts.map