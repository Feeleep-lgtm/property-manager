import { HttpException } from "./root.js";

export class UnprocessableEntity extends HttpException {
  constructor(errorCode, message, error) {
    super(message, errorCode, 422, error);
  }
}
