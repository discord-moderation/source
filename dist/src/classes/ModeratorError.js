"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeratorError = void 0;
const constants_1 = require("../constants");
function createMessage(msg, ...args) {
    if (typeof msg === "string")
        return msg;
    return msg(...args);
}
class ModeratorError extends Error {
    constructor(code, ...args) {
        if (!Object.keys(constants_1.ERROR_MESSAGES).includes(code))
            throw new TypeError(`Error code '${code}' doesn't exist.`);
        super(createMessage(constants_1.ERROR_MESSAGES[code], ...args));
        this.errorCode = code;
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, ModeratorError);
    }
    get name() {
        return `${super.name} [${this.errorCode}]`;
    }
    get code() {
        return this.errorCode;
    }
}
exports.ModeratorError = ModeratorError;
exports.default = ModeratorError;
//# sourceMappingURL=ModeratorError.js.map