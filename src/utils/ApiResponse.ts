/**
 * Standard API Response payload class that can be triggered across the App
 * to guarantee centralized and consistent JSON structures.
 */
export class ApiResponse<T> {
  public statusCode: number;
  public data: T;
  public message: string;
  public success: boolean;

  constructor(statusCode: number, data: T, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // true for 200-399 responses
  }
}
