"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moderation = void 0;
const Base_1 = require("./Base");
const Utils_1 = require("./Utils");
const ModeratorError_1 = __importDefault(require("./ModeratorError"));
/**
 * Main Moderation Class
 *
 * @class
 * @classdesc Class that enables Moderation System
 * @extends {Base}
 */
class Moderation extends Base_1.Base {
    /**
     * @param {Client} client - Discord.JS Client
     * @param {Options} options - Module Options
     *
     * @constructor
     */
    constructor(client, options) {
        super();
        /**
         * Discord Client
         * @type {Client}
         */
        this.client = client;
        /**
         * Module Options
         * @type {Options}
         */
        this.options = options;
        /**
         * Module Utils
         * @type {Utils}
         */
        this.utils = new Utils_1.Utils(this.client, this.options);
        /**
         * Module Ready State
         * @type {boolean}
         */
        this.isReady = false;
        if (this.options.storageType === 'json')
            this.utils.checkFile();
        this.client.on('ready', async () => {
            await this.utils.checkMutes();
        });
        this.client.on('guildMemberAdd', async (member) => {
            await this.utils.checkMute(member);
        });
    }
    /**
     * Method that Mutes or Temp Mutes Member
     *
     * @param {string} type - Type of the Mute
     * @param {Message} message - Discord Message
     * @param {GuildMember} member - Member to Mute
     * @param {string} reason - Reason of the Mute
     * @param {number} time - Time of the Temp Mute
     *
     * @returns {Promise<MutesData>}
     * @emits Moderation#muteMember
     */
    mute(type, message, member, reason, time) {
        return new Promise(async (res, rej) => {
            if (!['mute', 'tempmute'].includes(type))
                throw new ModeratorError_1.default('INVALID_TYPE', ['mute', 'tempmute'], type, 'mute#type');
            if (type === 'tempmute' && time === undefined)
                throw new ModeratorError_1.default('UNDEFINED_VALUE', 'Number', 'undefined', 'mute#time');
            return res(await this.mutes.create(type, message, member, reason, time));
        });
    }
    /**
     * Method that unmutes Member
     *
     * @param {GuildMember} member - Member to Mute
     *
     * @returns {Promise<MutesData>}
     * @emits Moderation#unmuteMember
     */
    unmute(member) {
        return new Promise(async (res, rej) => {
            return res(await this.mutes.delete(member));
        });
    }
}
exports.Moderation = Moderation;
//# sourceMappingURL=Moderation.js.map