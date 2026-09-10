

export class AppError extends Error {
  statusCode: number;
  type: string;

  constructor(
    statusCode: number,
    message: string,
    type: string,
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.type = type;
    this.name = "AppError";

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}


// throw new AppError(
//   404,
//   "Doctor not found",
//   "NOT_FOUND",
//   "Custom stack trace here"
// );
