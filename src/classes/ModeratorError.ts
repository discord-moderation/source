import { ERROR_MESSAGES } from "../constants";

function createMessage(msg: string | ((...x: any) => string), ...args: any) {
  if (typeof msg === "string") return msg;

  return msg(...args);
}

export class ModeratorError extends Error {
  errorCode: string;

  constructor(code: keyof typeof ERROR_MESSAGES, ...args: any) {
    if (!Object.keys(ERROR_MESSAGES).includes(code))
      throw new TypeError(`Error code '${code}' doesn't exist.`);

    super(createMessage(ERROR_MESSAGES[code], ...args));
    this.errorCode = code;

    if (Error.captureStackTrace) Error.captureStackTrace(this, ModeratorError);
  }

  get name() {
    return `${super.name} [${this.errorCode}]`;
  }

  get code() {
    return this.errorCode;
  }
}

export default ModeratorError;
