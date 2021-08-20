import { Options, MuteTypes, MutesData } from "../constants";
import { Client, Guild, GuildMember, Message, Role } from "discord.js";
import { Base } from "./Base";
import { Utils } from "./Utils";
import { Logger } from "./Logger";
export declare interface MuteManager {
    client: Client;
    options: Options;
    logger: Logger;
    utils: Utils;
}
/**
 * MuteManager Class
 *
 * @class
 * @classdesc Class that Handles/Creates/Removes Mutes
 * @extends {Base}
 */
export declare class MuteManager extends Base {
    /**
     *
     * @param {Client} client Discord.JS Client
     * @param {Options} options Module Options
     *
     * @constructor
     */
    constructor(client: Client, options: Options);
    /**
     * This method sets Mute Role.
     *
     * @param {Guild} guild Discord Guild
     * @param {Role} role Discord Role
     * @returns {Promise<boolean>}
     */
    setRole(guild: Guild, role: Role): Promise<boolean>;
    /**
     * This method getting Mute Role.
     *
     * @param {Guild} guild Discord Guild
     * @returns {Promise<boolean>}
     */
    getRole(guild: Guild): Promise<null | Role>;
    /**
     * Method that finds Mute in Storage
     *
     * @param {GuildMember} member Discord Member
     * @returns {Promise<MutesData>}
     */
    getMute(member: GuildMember): Promise<MutesData | null>;
    /**
     * This is method that mutes member.
     *
     * @param {string} type Mute Type
     * @param {Message} message Message
     * @param {GuildMember} member Discord Guild Member
     * @param {string} reason Reason of the Mute
     * @param {number} time Time of Temp Mute
     *
     * @returns {Promise<MutesData>}
     */
    create(type: MuteTypes, message: Message, member: GuildMember, reason?: string, time?: number): Promise<MutesData>;
    /**
     * Method that removes Mute from Member
     *
     * @param {Message} message Discord Message
     * @param {GuildMember} member Discord Member
     *
     * @fires Moderation#unmuteMember
     * @returns {Promise<MutesData>}
     */
    delete(member: GuildMember): Promise<MutesData>;
    /**
     * Private method that will handle Mute
     *
     * @param {Guild} guild Discord Guild
     * @param {GuildMember} member Guild Member
     * @param {number} time Time of the Mute
     * @param {MutesData} muteData Mute Data
     * @returns {Promise<null | boolean>}
     *
     * @emits Moderation#muteMember
     */
    handleUtilsMute(member: GuildMember): Promise<boolean>;
    /**
     * Private method that will handle Mute
     *
     * @param {Guild} guild Discord Guild
     * @param {GuildMember} member Guild Member
     * @param {number} time Time of the Mute
     * @param {MutesData} muteData Mute Data
     * @returns {Promise<null | boolean>}
     *
     * @emits Moderation#unmuteMember
     */
    private handleMute;
}
//# sourceMappingURL=MuteManager.d.ts.map