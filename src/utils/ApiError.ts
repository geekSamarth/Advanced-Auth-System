/**
 * Standard custom API Error class.
 * Allows creating detailed error structures with a statusCode and an errors array payload
 * that our global error handler logic can safely parse and serialize.
 */
export class ApiError extends Error {
  public status: number;
  public data: any;
  public success: boolean;
  public errors: any[];

  constructor(
    status: number,
    message = "Something went wrong",
    errors: any[] = [],
    stack = "",
  ) {
    super(message);
    this.status = status;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
