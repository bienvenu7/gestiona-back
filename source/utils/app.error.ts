import { ValidationErrorItem } from '../types/error';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: ValidationErrorItem[];

  constructor(
    message: string,
    statusCode: number,
    errors?: ValidationErrorItem[]
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
