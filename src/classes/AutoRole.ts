import { Client, Guild, Role } from "discord.js";
import { Options, ReturnObject } from "../constants";
import { SystemsManager } from "./SystemsManager";
import { Logger } from "./Logger";
import { Utils } from "./Utils";

export interface AutoRole {
  client: Client;
  options: Options;

  systems: SystemsManager;
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
     * Systems Manager
     * @type {SystemsManager}
     */
    this.systems = new SystemsManager(this.client, this.options);

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
   * @returns {Promise<ReturnObject | Role | null>}
   */
  get(guild: Guild): Promise<ReturnObject | Role | null> {
    return new Promise(async (res, rej) => {
      if (!guild) {
        return rej(this.logger.warn('Specify "Guild" in AutoRole#get'));
      }

      const status = await this.systems.status(guild, "autoRole");
      if (!status) {
        return res({
          status: false,
          message: `AutoRole is disabled in the guild with ID "${guild.id}"!`,
        });
      }

      const { autoRole } = await this.utils.getGuild(guild);
      if (!autoRole) return;

      const role = guild.roles.cache.get(autoRole);
      if (!role) return res(null);

      return res(role);
    });
  }

  /**
   * Method that sets Guild Auto-Role
   *
   * @param {Guild} guild Discord Guild
   * @param {Role} role Discord Role
   * @returns {Promise<ReturnObject | boolean>}
   */
  set(guild: Guild, role: Role): Promise<ReturnObject | boolean> {
    return new Promise(async (res, rej) => {
      if (!guild) {
        return rej(this.logger.error('Specify "Guild" in AutoRole#set'));
      }

      if (!role) {
        return rej(this.logger.error('Specify "Role" in AutoRole#set'));
      }

      const status = await this.systems.status(guild, "autoRole");
      if (!status) {
        return res({
          status: false,
          message: `AutoRole is disabled in the guild with ID "${guild.id}"!`,
        });
      }

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
   * @returns {Promise<ReturnObject | boolean>}
   */
  delete(guild: Guild): Promise<ReturnObject | boolean> {
    return new Promise(async (res, rej) => {
      if (!guild) {
        return rej(this.logger.warn('Specify "Guild" in AutoRole#delete'));
      }

      const status = await this.systems.status(guild, "autoRole");
      if (!status) {
        return res({
          status: false,
          message: `AutoRole is disabled in the guild with ID "${guild.id}"!`,
        });
      }

      const data = await this.utils.getGuild(guild);
      data.autoRole = null;

      await this.utils.setData(guild, data);
      return res(true);
    });
  }
}
