export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message = "Bad Request") {
    return new ApiError(400, message);
  }
  static notFound(message = "Not Found") {
    return new ApiError(404, message);
  }
  static internal(message = "Internal Server Error") {
    return new ApiError(500, message);
  }
}
