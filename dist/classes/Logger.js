"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const colors_1 = __importDefault(require("colors"));
/**
 * Class that Create Logs in the Console.
 *
 * @class
 * @classdesc Logger Class
 */
class Logger {
    constructor() {
        this.tag = "[DM]";
    }
    /**
     * Logging Something
     *
     * @param {String} message Message to Log
     * @returns {void}
     */
    log(message) {
        return console.log(`${this.tag}: ${message}`);
    }
    /**
     * Logging Something
     *
     * @param {String} message Message to Log
     * @returns {void}
     */
    warn(message) {
        return console.log(colors_1.default.yellow(`${this.tag}: ${message}`));
    }
    /**
     * Logging Something
     *
     * @param {String} message Message to Log
     * @returns {void}
     */
    error(message) {
        return console.log(colors_1.default.red(`${this.tag}: ${message}`));
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map