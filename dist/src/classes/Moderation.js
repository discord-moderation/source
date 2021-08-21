"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moderation = void 0;
// Imports
const Base_1 = require("./Base");
const Utils_1 = require("./Utils");
const MuteManager_1 = require("./MuteManager");
const WarnManager_1 = require("./WarnManager");
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
     * @param {Client} client Discord.JS Client
     * @param {Options} options Module Options
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
         * MuteManager Class
         * @type {MuteManager}
         */
        this.mutes = new MuteManager_1.MuteManager(this.client, this.options);
        /**
         * WarnManager Class
         * @type {WarnManager}
         */
        this.warns = new WarnManager_1.WarnManager(this.client, this.options);
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
        if (this.options.storageType === "json")
            this.utils.checkFile();
        this.client.on("ready", async () => {
            await this.utils.checkMutes();
        });
        this.client.on("guildMemberAdd", async (member) => {
            await this.checkMute(member);
        });
    }
    /**
     * Method that Mutes or Temp Mutes Member
     *
     * @param {string} type Type of the Mute
     * @param {Message} message Discord Message
     * @param {GuildMember} member Member to Mute
     * @param {string} reason Reason of the Mute
     * @param {number} time Time of the Temp Mute
     *
     * @returns {Promise<MutesData>}
     * @emits Moderation#muteMember
     */
    mute(type, message, member, reason, time) {
        return new Promise(async (res, rej) => {
            if (!["mute", "tempmute"].includes(type))
                throw new ModeratorError_1.default("INVALID_TYPE", ["mute", "tempmute"], type, "mute#type");
            if (type === "tempmute" && time === undefined)
                throw new ModeratorError_1.default("UNDEFINED_VALUE", "Number", "undefined", "mute#time");
            return res(await this.mutes.create(type, message, member, reason, time));
        });
    }
    /**
     * Method that unmutes Member
     *
     * @param {GuildMember} member Member for Mute
     *
     * @returns {Promise<MutesData>}
     * @emits Moderation#unmuteMember
     */
    unmute(member) {
        return new Promise(async (res, rej) => {
            if (!member)
                throw new ModeratorError_1.default("UNDEFINED_VALUE", "GuildMember", "undefined", "unmute#member");
            return res(await this.mutes.delete(member));
        });
    }
    /**
     * Method that warns Member
     *
     * @param {Message} message Discord Message
     * @param {GuildMember} member Member for Warn
     * @param {string} reason Reaon of the Warn
     *
     * @fires Moderation#warnAdd
     * @fires Moderation#warnKick
     * @returns {Promise<WarnsData>}
     */
    warn(message, member, reason) {
        return new Promise(async (res, rej) => {
            if (!message)
                throw new ModeratorError_1.default("UNDEFINED_VALUE", "Message", "undefined", "warn#message");
            if (!member)
                throw new ModeratorError_1.default("UNDEFINED_VALUE", "GuildMember", "undefined", "warn#member");
            if (!reason)
                reason = "No reason provided.";
            return res(this.warns.create(message, member, reason));
        });
    }
    /**
     * Method that removes last warn from Member
     *
     * @param {GuildMember} member Member for Warn
     *
     * @fires Moderation#warnRemove
     * @returns {Promise<WarnsData>}
     */
    unwarn(member) {
        return new Promise(async (res, rej) => {
            if (!member)
                throw new ModeratorError_1.default("UNDEFINED_VALUE", "GuildMember", "undefined", "unwarn#member");
            return res(await this.warns.delete(member));
        });
    }
    /**
     * Method that removes last warn from Member
     *
     * @param {GuildMember} member Member for Warn
     * @returns {Promise<WarnsData[] | undefined>}
     */
    allWarns(member) {
        return new Promise(async (res, rej) => {
            if (!member)
                throw new ModeratorError_1.default("UNDEFINED_VALUE", "GuildMember", "undefined", "warns#member");
            const warns = await this.warns.all(member);
            if (warns === null)
                return res(undefined);
            return res(warns);
        });
    }
    /**
     * Method that will be used when Member joins Server
     *
     * @param {GuildMember} member Discord Member
     *
     * @private
     * @returns {Promise<boolean>}
     */
    checkMute(member) {
        return new Promise(async (res, rej) => {
            if (!member)
                return this.logger.error('Specify "GuildMember" in Utils#checkMute');
            await this.utils.getGuild(member.guild);
            const mute = await this.mutes.getMute(member);
            if (mute) {
                await this.mutes.handleUtilsMute(member);
                return res(true);
            }
            else {
                return res(false);
            }
        });
    }
}
exports.Moderation = Moderation;
//# sourceMappingURL=Moderation.js.map