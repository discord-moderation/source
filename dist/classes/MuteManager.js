"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuteManager = void 0;
const Base_1 = require("./Base");
const Utils_1 = require("./Utils");
const Logger_1 = require("./Logger");
// Storage Imports
const quick_db_1 = __importDefault(require("quick.db"));
const fs_1 = __importDefault(require("fs"));
/**
 * MuteManager Class
 *
 * @class
 * @classdesc Class that Handles/Creates Mutes
 * @extends {Base}
 */
class MuteManager extends Base_1.Base {
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
         * Module Logger
         * @type {Logger}
         */
        this.logger = new Logger_1.Logger();
        /**
         * Module Utils
         * @type {Utils}
         */
        this.utils = new Utils_1.Utils(this.client, this.options);
    }
    /**
     * This method sets Mute Role.
     *
     * @param {Guild} guild - Discord Guild
     * @param {Role} role - Discord Role
     * @returns {Promise<boolean>}
     */
    setRole(guild, role) {
        return new Promise(async (res, _rej) => {
            if (!role)
                return this.logger.error('Specify "Role" in MuteManager#setRole');
            switch (this.options.storageType) {
                case 'sqlite': {
                    await this.utils.getGuild(guild);
                    quick_db_1.default.set(`guild.${guild.id}.muteRole`, role.id);
                    return res(true);
                }
                case 'json': {
                    const data = await this.utils.getGuild(guild);
                    data.muteRole = role.id;
                    const file = JSON.parse(fs_1.default.readFileSync(this.options.storagePath).toString());
                    fs_1.default.writeFileSync(this.options.storagePath, JSON.stringify(file, null, '\t'));
                    return res(true);
                }
            }
        });
    }
    /**
     * This method getting Mute Role.
     *
     * @param {Guild} guild - Discord Guild
     * @returns {Promise<boolean>}
     */
    getRole(guild) {
        return new Promise(async (res, rej) => {
            if (!guild)
                return rej(this.logger.warn('Specify "Guild" in MuteManager#getRole'));
            switch (this.options.storageType) {
                case 'sqlite': {
                    const data = await this.utils.getGuild(guild);
                    if (data.muteRole === null)
                        return res(null);
                    const role = guild.roles.cache.get(data.muteRole);
                    if (!role)
                        return res(null);
                    return res(role);
                }
                case 'json': {
                    const data = await this.utils.getGuild(guild);
                    if (data.muteRole === null)
                        return res(null);
                    const role = guild.roles.cache.get(data.muteRole);
                    if (!role)
                        return res(null);
                    return res(role);
                }
            }
        });
    }
    /**
     * Method that finds Mute in Storage
     *
     * @param {GuildMember} member - Discord Member
     *
     * @returns {Promise<MutesData>}
     */
    getMute(member) {
        return new Promise(async (res, rej) => {
            if (!member)
                return this.logger.error('Specify "GuildMember" in MuteManager#getMute');
            const data = await this.utils.getGuild(member.guild);
            const mute = data.mutes.find((x) => x.memberID === member.id);
            if (mute)
                return res(mute);
            else
                return res(null);
        });
    }
    /**
     * This is method that mutes member.
     *
     * @param {string} type - Mute Type
     * @param {Message} message - Message
     * @param {GuildMember} member - Discord Guild Member
     * @param {string} reason - Reason of the Mute
     * @param {number} time - Time of Temp Mute
     *
     * @returns {Promise<MutesData>}
     */
    create(type, message, member, reason, time) {
        return new Promise(async (res, rej) => {
            if (!type)
                return this.logger.warn('Specify "type" in MuteManager#create');
            if (!message)
                return this.logger.warn('Specify "message" in MuteManager#create');
            if (!member)
                return this.logger.warn('Specify "member" in MuteManager#create');
            if (!reason)
                reason = 'No reason provided.';
            if (type === 'tempmute' && time === undefined)
                return this.logger.warn('No "time" specified in MuteManager#create (tempmute)');
            const mute = await this.getMute(member);
            if (mute !== null)
                return this.logger.error('Member already has Mute!');
            switch (this.options.storageType) {
                case 'sqlite': {
                    if (message.guild === null)
                        return;
                    const data = await this.utils.getGuild(message.guild);
                    const role = await this.getRole(message.guild);
                    if (role === null)
                        return;
                    if (time === undefined)
                        return;
                    var muteData = {
                        id: data.mutes.length + 1,
                        type,
                        guildID: message.guild.id,
                        memberID: member.id,
                        moderatorID: message.author.id,
                        channelID: message.channel.id,
                        reason,
                    };
                    if (type === 'tempmute') {
                        muteData = {
                            ...muteData,
                            time,
                            unmutedAt: Date.now() + time,
                        };
                    }
                    await member.roles.add(role).catch((err) => {
                        return rej(this.logger.error(err.message));
                    });
                    if (type === 'tempmute')
                        await this.handleMute(message.guild, member, time, muteData);
                    data.mutes.push(muteData);
                    quick_db_1.default.set(`guild.${message.guild.id}`, data);
                    this.emit('muteMember', muteData);
                    return res(muteData);
                }
                case 'json': {
                    if (message.guild === null)
                        return;
                    const data = await this.utils.getGuild(message.guild);
                    const role = await this.getRole(message.guild);
                    if (role === null)
                        return;
                    if (time === undefined)
                        return;
                    var muteData = {
                        id: data.mutes.length + 1,
                        type,
                        guildID: message.guild.id,
                        memberID: member.id,
                        moderatorID: message.author.id,
                        channelID: message.channel.id,
                        reason,
                    };
                    if (type === 'tempmute') {
                        muteData = {
                            ...muteData,
                            time,
                            unmutedAt: Date.now() + time,
                        };
                    }
                    await member.roles.add(role).catch((err) => {
                        return rej(this.logger.error(err.message));
                    });
                    if (type === 'tempmute')
                        await this.handleMute(message.guild, member, time, muteData);
                    const file = JSON.parse(fs_1.default.readFileSync(this.options.storagePath).toString());
                    file.mutes.push(muteData);
                    fs_1.default.writeFileSync(this.options.storagePath, JSON.stringify(file, null, '\t'));
                    this.emit('muteMember', muteData);
                    return res(muteData);
                }
            }
        });
    }
    /**
     * Method that removes Mute from Member
     *
     * @param {Message} message - Discord Message
     * @param {GuildMember} member - Discord Member
     *
     * @fires Moderation#unmuteMember
     * @returns {Promise<MutesData>}
     */
    delete(member) {
        return new Promise(async (res, rej) => {
            const mute = await this.getMute(member);
            if (mute === null)
                return this.logger.error("Member hasn't any Mute!");
            else {
                const data = await this.utils.getGuild(member.guild);
                const role = await this.getRole(member.guild);
                if (!role)
                    return this.logger.error("Server hasn't any Mute Role!");
                const roleCheck = member.roles.cache.find((r) => r.id === role.id);
                if (!roleCheck)
                    return this.logger.error("Member haven't Mute Role!");
                await member.roles.remove(role).catch((err) => {
                    return this.logger.error(err);
                });
                data.mutes.filter((muteData) => muteData.memberID !== member.id);
                this.utils.setData(member.guild, data);
                this.emit('unmuteMember', {
                    id: mute.id,
                    type: mute.type,
                    guildID: member.guild.id,
                    memberID: member.id,
                    moderatorID: mute.moderatorID,
                    channelID: mute.channelID,
                    reason: mute.reason,
                    time: mute.time !== undefined ? mute.time : undefined,
                });
                return mute;
            }
        });
    }
    /**
     * Private method that will handle Mute
     *
     * @param {Guild} guild - Discord Guild
     * @param {GuildMember} member - Guild Member
     * @param {number} time - Time of the Mute
     * @param {MutesData} muteData - Mute Data
     * @returns {Promise<null | boolean>}
     *
     * @emits Moderation#unmuteMember
     */
    handleUtilsMute(member) {
        return new Promise(async (res, rej) => {
            var _a, _b;
            const data = await this.utils.getGuild(member.guild);
            if (data.muteRole === null)
                return res(false);
            const lastMute = data.mutes.find((mute) => mute.memberID === member.id);
            if ((lastMute === null || lastMute === void 0 ? void 0 : lastMute.channelID) === undefined)
                return res(false);
            const role = await this.getRole(member.guild);
            if (!role)
                return res(false);
            if (((_b = (_a = this.client) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id) === undefined)
                return res(false);
            const muteData = {
                id: data.mutes.length + 1,
                type: 'mute',
                guildID: member.guild.id,
                memberID: member.id,
                moderatorID: this.client.user.id,
                channelID: lastMute.channelID,
                reason: 'User rejoined server.',
            };
            await member.roles.add(role).catch((err) => {
                return rej(this.logger.error(err.message));
            });
            this.emit('muteMember', muteData);
            return res(true);
        });
    }
    /**
     * Private method that will handle Mute
     *
     * @param {Guild} guild - Discord Guild
     * @param {GuildMember} member - Guild Member
     * @param {number} time - Time of the Mute
     * @param {MutesData} muteData - Mute Data
     * @returns {Promise<null | boolean>}
     *
     * @emits Moderation#unmuteMember
     */
    handleMute(guild, member, time, muteData) {
        return new Promise(async (res, rej) => {
            const data = await this.utils.getGuild(guild);
            if (data.muteRole === null)
                return res(null);
            const role = guild.roles.cache.get(data.muteRole);
            if (!role)
                return res(null);
            setTimeout(async () => {
                await member.roles.add(role).catch((err) => {
                    return rej(this.logger.error(err.message));
                });
                this.emit('unmuteMember', muteData);
                return res(true);
            }, time);
        });
    }
}
exports.MuteManager = MuteManager;
//# sourceMappingURL=MuteManager.js.map