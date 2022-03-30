import {
  AvaliableSystems,
  ModuleSystems,
  Options,
  ReturnObject,
} from "../constants";
import { Client, Guild } from "discord.js";
import { Logger } from "./Logger";
import { Utils } from "./Utils";
import { Base } from "./Base";

export interface SystemsManager {
  client: Client;
  options: Options;

  utils: Utils;
  logger: Logger;
}

export class SystemsManager extends Base {
  /**
   *
   * @param {Client} client Discord.JS Client
   * @param {Options} options Module Options
   *
   * @constructor
   */
  constructor(client: Client, options: Options) {
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
   * Method that Enables System
   *
   * @param {Guild} guild Guild
   * @param {AvaliableSystems} system System to enable
   *
   * @returns {Promise<ReturnObject | boolean>}
   */
  enable(
    guild: Guild,
    system: AvaliableSystems
  ): Promise<ReturnObject | boolean> {
    return new Promise(async (res, rej) => {
      const data = await this.utils.getGuild(guild);
      if (data.systems[system] === true) {
        return res({
          status: false,
          message: `System "${system}" is already enabled!`,
        });
      }

      data.systems[system] = true;
      await this.utils.setData(guild, data);

      return res(true);
    });
  }

  /**
   * Method that Disables System
   *
   * @param {Guild} guild Guild
   * @param {AvaliableSystems} system System to enable
   *
   * @returns {Promise<ReturnObject | boolean>}
   */
  disable(
    guild: Guild,
    system: AvaliableSystems
  ): Promise<ReturnObject | boolean> {
    return new Promise(async (res, rej) => {
      const data = await this.utils.getGuild(guild);
      if (data.systems[system] === false) {
        return res({
          status: false,
          message: `System "${system}" is already disabled!`,
        });
      }

      data.systems[system] = false;
      await this.utils.setData(guild, data);

      return res(true);
    });
  }

  /**
   * Method that shows Status of Guild System
   *
   * @param {Guild} guild Guild
   * @param {AvaliableSystems} system System Name
   *
   * @returns {Promise<boolean>}
   */
  status(guild: Guild, system: AvaliableSystems): Promise<boolean> {
    return new Promise(async (res, rej) => {
      const data = await this.utils.getGuild(guild);

      return res(data.systems[system]);
    });
  }

  /**
   * Method that Shows all the Guild Systems
   *
   * @param {Guild} guild Guild
   *
   * @returns {Promise<ModuleSystems>}
   */
  all(guild: Guild): Promise<ModuleSystems> {
    return new Promise(async (res, rej) => {
      const data = await this.utils.getGuild(guild);

      return res(data.systems);
    });
  }
}
