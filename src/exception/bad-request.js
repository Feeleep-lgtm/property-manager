import { ErrorCodes, HttpException } from "./root.js";

export class BadRequests extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
}
