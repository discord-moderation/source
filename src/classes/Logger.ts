import colors from "colors";

/**
 * Class that Create Logs in the Console.
 *
 * @class
 * @classdesc Logger Class
 */
export class Logger {
  public tag: string;

  constructor() {
    this.tag = "[DM]";
  }

  /**
   * Logging Something
   *
   * @param {String} message Message to Log
   * @returns {void}
   */
  log(message: string): void {
    return console.log(`${this.tag}: ${message}`);
  }

  /**
   * Logging Something
   *
   * @param {String} message Message to Log
   * @returns {void}
   */
  warn(message: string): void {
    return console.log(colors.yellow(`${this.tag}: ${message}`));
  }

  /**
   * Logging Something
   *
   * @param {String} message Message to Log
   * @returns {void}
   */
  error(message: string): void {
    return console.log(colors.red(`${this.tag}: ${message}`));
  }
}
