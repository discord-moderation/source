"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarnManager = void 0;
const Base_1 = require("./Base");
const MuteManager_1 = require("./MuteManager");
const Utils_1 = require("./Utils");
const Logger_1 = require("./Logger");
/**
 * WarnManager Class
 *
 * @class
 * @classdesc Class that Handles/Creates/Removes Warns
 * @extends {Base}
 */
class WarnManager extends Base_1.Base {
    /**
     *
     * @param {Client} client Discord.JS Client
     * @param {Options} options Module Options
     *
     * @constructor
     */
    constructor(client, options) {
        super();
        this.client = client;
        this.options = options;
        this.mutes = new MuteManager_1.MuteManager(this.client, this.options);
        this.utils = new Utils_1.Utils(this.client, this.options);
        this.logger = new Logger_1.Logger();
    }
    /**
     * Get last Member Warn
     *
     * @param {GuildMember} member Discord Member
     * @returns {Promise<WarnsData | null>}
     */
    getWarn(member) {
        return new Promise(async (res, rej) => {
            if (!member)
                return this.logger.error('Specify "GuildMember" in WarnManager#getWarn!');
            const data = await this.utils.getGuild(member.guild);
            const warns = data.warns.length;
            const lastWarn = data.warns[warns - 1];
            if (!lastWarn || lastWarn === undefined)
                return res(null);
            return res(lastWarn);
        });
    }
    /**
     * Method that creates Warn.
     *
     * @param {Message} message Discord Message
     * @param {GuildMember} member Discord Member
     * @param {string} reason Warn Reason
     *
     * @fires Moderation#warnAdd
     * @fires Moderation#warnKick
     * @returns {Promise<WarnsData>}
     */
    create(message, member, reason) {
        return new Promise(async (res, rej) => {
            if (!message)
                return this.logger.error('Specify "Message" in WarnManager#create!');
            if (!member)
                return this.logger.error('Specify "GuildMember" in WarnManager#create!');
            if (!reason)
                reason = "No reason provided";
            const data = await this.utils.getGuild(member.guild);
            const warnData = {
                id: data.warns.length + 1,
                guildID: member.guild.id,
                memberID: member.id,
                moderatorID: message.author.id,
                channelID: message.channel.id,
                reason: reason,
            };
            data.warns.push(warnData);
            await this.utils.setData(member.guild, data);
            if (data.warns.length === 3) {
                await this.mutes.create("tempmute", message, member, "User reached 3 warns | AutoMute.", 3600000);
                this.emit("warnAdd", warnData);
                return res(warnData);
            }
            else if (data.warns.length === 6) {
                await member.kick("User reached 6 warns | AutoKick.").catch((err) => {
                    return this.logger.error(err);
                });
                data.warns.filter((w) => w.memberID !== member.id);
                await this.utils.setData(member.guild, data);
                await this.emit("warnKick", warnData);
                return res(warnData);
            }
        });
    }
    /**
     * Method that removes last warn from member
     *
     * @param {GuildMember} member Discord Member
     *
     * @fires Moderation#warnRemove
     * @returns {Promise<WarnsData>}
     */
    delete(member) {
        return new Promise(async (res, rej) => {
            if (!member)
                return this.logger.error('Specify "GuildMember" in WarnManager#delete!');
            const data = await this.utils.getGuild(member.guild);
            const lastWarn = await this.getWarn(member);
            if (!lastWarn)
                return this.logger.error("No Warn Data founded in Storage!");
            const warnData = {
                id: lastWarn.id,
                guildID: member.guild.id,
                memberID: member.id,
                moderatorID: lastWarn.moderatorID,
                channelID: lastWarn.channelID,
                reason: lastWarn.reason,
            };
            this.emit("warnRemove", warnData);
            data.warns.filter((w) => w.id !== lastWarn.id);
            await this.utils.setData(member.guild, data);
            return res(warnData);
        });
    }
    /**
     * Method that returns all member warns
     *
     * @param {GuildMember} member Discord Member
     * @returns {Promise<WarnsData[] | null>}
     */
    all(member) {
        return new Promise(async (res, rej) => {
            if (!member)
                return this.logger.error('Specify "GuildMember" in WarnManager#all!');
            const data = await this.utils.getGuild(member.guild);
            const warns = data.warns;
            if (!warns || warns.length)
                return res(null);
            else
                return res(warns);
        });
    }
}
exports.WarnManager = WarnManager;
//# sourceMappingURL=WarnManager.js.map