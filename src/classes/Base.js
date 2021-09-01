const { EventEmitter } = require("events");
const events = new EventEmitter();

/**
 * @class
 * @classdesc Class that using in other classes
 *
 * @private
 */
class Base {
    /**
     * Handles all the Events
     *
     * @param {String} event Event Name
     * @param {Function} fn Callback
     * @returns {EventEmitter}
     */
    on(event, fn) {
        events.on(event, fn)
    }
    /**
     * Handles all the Events
     *
     * @param {String} event Event Name
     * @param {Function} fn Callback
     * @returns {EventEmitter}
     */
    once(event, fn) {
        events.once(event, fn)
    }
    
    /**
     * Emits any Event
     *
     * @param {String} event Event Name
     * @param {Function} fn Callback
     * @returns {boolean}
     */
    emit(event, ...args) {
        events.emit(event, args[0])
    }
}

module.exports = Base;
