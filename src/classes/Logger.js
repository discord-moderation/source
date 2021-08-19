const colors = require('colors');

/**
 * Logger Class
 * 
 * @class
 * @classdesc Class that Logging errors/data.
 */
class Logger {
    /**
     * @param {String} message
     * 
     * @returns {void}
     */
    log(...message) {
        return console.log(`[Moderation | ${colors.bgBlue('LOG')}] ${message}`);
    }

    /**
     * @param  {String} message 
     * 
     * @returns {void}
     */
    warn(...message) {
        return console.log(`[Moderation | ${colors.bgYellow('WARN')}] ${message}`);
    }

    /**
     * @param  {String} message
     * 
     * @returns {void}
     */
    error(...message) {
        return console.log(`[Moderation | ${colors.bgRed('ERROR')}] ${message}`);
    }
}

module.exports = Logger;