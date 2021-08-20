import { Base } from "./Base";
import { Utils } from "./Utils";
import { MuteManager } from "./MuteManager";
import { WarnManager } from "./WarnManager";
import { Options, MuteTypes, MutesData, WarnsData } from "../constants";
import { Client, GuildMember, Message } from "discord.js";
export declare interface Moderation {
    client: Client;
    options: Options;
    utils: Utils;
    mutes: MuteManager;
    warns: WarnManager;
    isReady: boolean;
}
/**
 * Main Moderation Class
 *
 * @class
 * @classdesc Class that enables Moderation System
 * @extends {Base}
 */
export declare class Moderation extends Base {
    /**
     * @param {Client} client Discord.JS Client
     * @param {Options} options Module Options
     *
     * @constructor
     */
    constructor(client: Client, options: Options);
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
    mute(type: MuteTypes, message: Message, member: GuildMember, reason?: string, time?: number): Promise<MutesData>;
    /**
     * Method that unmutes Member
     *
     * @param {GuildMember} member Member for Mute
     *
     * @returns {Promise<MutesData>}
     * @emits Moderation#unmuteMember
     */
    unmute(member: GuildMember): Promise<MutesData>;
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
    warn(message: Message, member: GuildMember, reason?: string): Promise<WarnsData>;
    /**
     * Method that removes last warn from Member
     *
     * @param {GuildMember} member Member for Warn
     *
     * @fires Moderation#warnRemove
     * @returns {Promise<WarnsData>}
     */
    unwarn(member: GuildMember): Promise<WarnsData>;
    /**
     * Method that removes last warn from Member
     *
     * @param {GuildMember} member Member for Warn
     * @returns {Promise<WarnsData[] | undefined>}
     */
    allWarns(member: GuildMember): Promise<WarnsData[] | undefined>;
}
//# sourceMappingURL=Moderation.d.ts.map