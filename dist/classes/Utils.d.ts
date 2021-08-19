import { Client, Guild, GuildMember } from 'discord.js';
import { MuteManager } from './MuteManager';
import { GuildData } from '../types/GuildData';
import { Options } from '../types/Options';
import { Logger } from './Logger';
import { Base } from './Base';
export declare interface Utils {
    client: Client;
    mutes: MuteManager;
    options: Options;
    logger: Logger;
}
/**
 * Utils Class
 *
 * @class
 * @classdesc Class that including some methods.
 * @extends {Base}
 */
export declare class Utils extends Base {
    constructor(client: Client, options: Options);
    /**
     * Method that will be used when Member joins Server
     *
     * @param {GuildMember} member - Discord Member
     *
     * @returns {Promise<boolean>}
     */
    checkMute(member: GuildMember): Promise<boolean>;
    /**
     * Method that will return Guild Data
     *
     * @param {Guild} guild - Discord Guild
     * @returns {Promise<GuilData>}
     */
    getGuild(guild: Guild): Promise<GuildData>;
    /**
     * Method that created Guild Data
     *
     * @param {Guild} guild - Discord Guild
     * @returns {Promise<boolean>}
     */
    createGuild(guild: Guild): Promise<boolean>;
    /**
     * Method that changes data in Storage
     *
     * @param {Guild} guild - Discord Guild
     * @param {GuildData} newData - New Guild Data
     *
     * @returns {Promise<boolean>}
     */
    setData(guild: Guild, newData: GuildData): Promise<boolean>;
    /**
     * Method that will check Storage File every 5 seconds
     *
     * @returns {Promise<boolean>}
     */
    checkFile(): Promise<boolean>;
    /**
     * Method that checks mutes when client is ready
     *
     * @returns {Promise<boolean>}
     */
    checkMutes(): Promise<boolean>;
    /**
     * Method that create Timeout with Promise
     *
     * @param {number} ms - Milliseconds
     * @returns {Promise<unknown>}
     */
    wait(ms: number): Promise<unknown>;
}
//# sourceMappingURL=Utils.d.ts.map