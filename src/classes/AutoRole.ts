import { Client, Guild, Role } from "discord.js";
import { Utils } from "./Utils";
import { Logger } from "./Logger";
import { Options } from '../constants';

export declare interface AutoRole {
    client: Client;
    options: Options;

    utils: Utils;
    logger: Logger;
}

/**
 * Class that handles Auto Role System.
 *
 * @class
 * @classdesc Auto-Role System
 */
export class AutoRole {
    /**
     * 
     * @param {Client} client Discord.JS Client
     * @param {Options} options Module Options
     * 
     * @constructor
     */
    constructor(client: Client, options: Options) {
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
        this.utils = new Utils(this.client, this.options);

        /**
         * Module Logger
         * @type {Logger}
         */
        this.logger = new Logger();
    }

    /**
     * Method that gets Guild Auto-Role
     * 
     * @param {Guild} guild Discord Guild
     * @returns {Promise<Role | null>}
     */
    get(guild: Guild): Promise<Role | null> {
        return new Promise(async(res, rej) => {
            if(!guild) return this.logger.error('Specify "Guild" in AutoRole#get');

            const { autoRole } = await this.utils.getGuild(guild);
            if(!autoRole) return;

            const role = guild.roles.cache.get(autoRole);
            if(!role) return res(null);

            return res(role);
        });
    }

    /**
     * Method that sets Guild Auto-Role
     * 
     * @param {Guild} guild Discord Guild
     * @param {Role} role Discord Role
     * @returns {Promise<boolean>}
     */
    set(guild: Guild, role: Role): Promise<boolean> {
        return new Promise(async(res, rej) => {
            if(!guild) return this.logger.error('Specify "Guild" in AutoRole#set');
            if(!role) return this.logger.error('Specify "Role" in AutoRole#set');

            const data = await this.utils.getGuild(guild);
            data.autoRole = role.id;

            await this.utils.setData(guild, data);
            return res(true);
        });
    }

    /**
     * Method that removes Guild Auto-Role
     * 
     * @param {Guild} guild Discord Guild
     * @returns {Promise<boolean>}
     */
    delete(guild: Guild): Promise<boolean> {
        return new Promise(async(res, rej) => {
            if(!guild) return this.logger.error('Specify "Guild" in AutoRole#delete');

            const data = await this.utils.getGuild(guild);
            data.autoRole = null;

            await this.utils.setData(guild, data);
            return res(true);
        });
    }
}