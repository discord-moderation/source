/// <reference types="node" />
import { EventEmitter } from "events";
import { Events } from "../constants";
/**
 * Base class that uses in all other classes.
 *
 * @class
 * @classdesc Base class that uses in all other classes.
 *
 * @private
 */
export declare class Base {
    /**
     * Handles all the Events
     *
     * @param {String} event Event Name
     * @param {Function} fn Callback
     * @returns {EventEmitter}
     */
    on<K extends keyof Events>(event: K, listener: (...args: Events[K][]) => void): EventEmitter;
    /**
     * Handles all the Events
     *
     * @param {String} event Event Name
     * @param {Function} fn Callback
     * @returns {EventEmitter}
     */
    once<K extends keyof Events>(event: K, listener: (...args: Events[K][]) => void): EventEmitter;
    /**
     * Emits any Event
     *
     * @param {String} event Event Name
     * @param {Function} fn Callback
     * @returns {boolean}
     */
    emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean;
}
/**
 * Module Options
 * @typedef {Object} Options
 * @prop {string} storageType - Storage Type (Json or SQLite)
 * @prop {string} storagePath - Storage Path (Only for Json type)
 */
/**
 * Mute Data
 * @typedef {Object} MutesData
 * @prop {number} id - ID of the Mute
 * @prop {string} type - Type of the Mute
 * @prop {string} guildID - Guild ID
 * @prop {string} memberID - Member ID
 * @prop {string} moderatorID - Moderator ID
 * @prop {string} channelID - Channel ID
 * @prop {number} time - Mute Time
 * @prop {number} unmutedAt - Time when Member will be Unmuted
 */
/**
 * Guild Data
 * @typedef {Object} GuildData
 * @prop {string} guildID - Guild ID
 * @prop {null | string} muteRole - Mute Role ID
 * @prop {Array<WarnsData>} warns - Guild Warns
 * @prop {Array<MutesData>} mutes - Guild Mutes
 * @prop {Array<ImmunityUsersData>} ImmunityUsersData - Users with Immunity
 */
/**
 * Warn Data
 * @typedef {Object} WarnsData
 * @prop {number} id - ID of the Warn
 * @prop {string} guildID - Guild ID
 * @prop {string} memberID - Member ID
 * @prop {string} moderatorID - Moderator ID
 * @prop {string} channelID - Channel ID
 * @prop {number | null} warns - Warns Length
 * @prop {string} reason - Warn Reason
 */
/**
 * Immunity Users Data
 * @typedef {Object} ImmunityUsersData
 * @prop {boolean} status - Status of Immunity
 * @prop {string} memberID - Member ID
 */
//# sourceMappingURL=Base.d.ts.map