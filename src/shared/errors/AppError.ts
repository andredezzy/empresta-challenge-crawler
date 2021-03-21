class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  public readonly headers: { [key: string]: string };

  constructor(message: string, statusCode = 400, headers = {}) {
    this.message = message;
    this.statusCode = statusCode;
    this.headers = headers;
  }
}

export default AppError;
