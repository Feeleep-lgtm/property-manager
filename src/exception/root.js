// errors.js
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export { AppError, NotFoundError, BadRequestError, UnauthorizedException };

export class HttpException extends Error {
  message;
  errorCode;
  statusCode;
  errors;

  constructor(message, ErrorCode, statusCode, error) {
    super(message);
    this.message = message;
    this.errorCode = ErrorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}
export const ErrorCodes = {
  USER_NOT_FOUND: 1001,
  USER_ALREADY_EXISTS: 1002,
  INCORRECT_PASSWORD: 1003,
  UNPROCESSABLE_ENTITY: 2001,
  INTERNAL_EXCEPTION: 3001,
};
