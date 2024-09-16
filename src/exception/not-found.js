import { ErrorCodes, HttpException } from "./root.js";

export class NotFound extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 404, null);
  }
}
