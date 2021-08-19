import { Options } from '../types/Options';
import { Base } from './Base';
import { Utils } from './Utils';
import { MuteManager } from './MuteManager';
import { MuteTypes } from '../constants';
import { MutesData } from '../types/MuteData';
import { Client, GuildMember, Message } from 'discord.js';
export declare interface Moderation {
    client: Client;
    options: Options;
    utils: Utils;
    mutes: MuteManager;
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
     * @param {Client} client - Discord.JS Client
     * @param {Options} options - Module Options
     *
     * @constructor
     */
    constructor(client: Client, options: Options);
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
    mute(type: MuteTypes, message: Message, member: GuildMember, reason?: string, time?: number): Promise<MutesData>;
    /**
     * Method that unmutes Member
     *
     * @param {GuildMember} member - Member to Mute
     *
     * @returns {Promise<MutesData>}
     * @emits Moderation#unmuteMember
     */
    unmute(member: GuildMember): Promise<MutesData>;
}
//# sourceMappingURL=Moderation.d.ts.map