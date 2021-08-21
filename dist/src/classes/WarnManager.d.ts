import { Client, GuildMember, Message } from "discord.js";
import { Base } from "./Base";
import { MuteManager } from "./MuteManager";
import { Utils } from "./Utils";
import { Logger } from "./Logger";
import { Options, WarnsData } from "../constants";
export declare interface WarnManager {
    client: Client;
    options: Options;
    mutes: MuteManager;
    utils: Utils;
    logger: Logger;
}
/**
 * WarnManager Class
 *
 * @class
 * @classdesc Class that Handles/Creates/Removes Warns
 * @extends {Base}
 */
export declare class WarnManager extends Base {
    /**
     *
     * @param {Client} client Discord.JS Client
     * @param {Options} options Module Options
     *
     * @constructor
     */
    constructor(client: Client, options: Options);
    /**
     * Get last Member Warn
     *
     * @param {GuildMember} member Discord Member
     * @returns {Promise<WarnsData | null>}
     */
    getWarn(member: GuildMember): Promise<WarnsData | null>;
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
    create(message: Message, member: GuildMember, reason?: string): Promise<WarnsData>;
    /**
     * Method that removes last warn from member
     *
     * @param {GuildMember} member Discord Member
     *
     * @fires Moderation#warnRemove
     * @returns {Promise<WarnsData>}
     */
    delete(member: GuildMember): Promise<WarnsData>;
    /**
     * Method that returns all member warns
     *
     * @param {GuildMember} member Discord Member
     * @returns {Promise<WarnsData[] | null>}
     */
    all(member: GuildMember): Promise<WarnsData[] | null>;
}
//# sourceMappingURL=WarnManager.d.ts.map