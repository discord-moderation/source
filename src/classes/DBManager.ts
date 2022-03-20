import { GuildData, Options } from "../constants";
import { Client } from "discord.js";
import { Logger } from "./Logger";
import Enmap from "enmap";

export interface DBManager {
  client: Client;
  options: Options;

  database: Enmap<string, GuildData>;
  logger: Logger;
}

/**
 * Database Manager Class
 *
 * @class
 * @classdesc Class that controls Database
 */
export class DBManager {
  /**
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
     * Module Logger
     * @type {Logger}
     */
    this.logger = new Logger();

    /**
     * Database
     * @type {Enmap<string, GuildData>}
     */
    this.database = new Enmap({
      name: "moderation",
      dataDir: this.options.dbPath,
      wal: false,
    });
  }

  /**
   * Method that Changes Guild Data from Database
   *
   * @param {string} id Discord Guild ID
   * @param {GuildData} value Value to Set
   *
   * @returns {Promise<boolean>}
   */
  set(id: string, value: GuildData): Promise<boolean> {
    return new Promise((res, rej) => {
      this.database.set(`moderation-${id}`, value);

      return res(true);
    });
  }

  /**
   * Method that Changes Property Value from Database
   *
   * @param {string} id Guild ID
   * @param {string} key Property Name
   * @param {any} value Value to Set
   *
   * @returns {Promise<boolean>}
   */
  setProp<K extends keyof GuildData>(
    id: string,
    key: K,
    value: GuildData[K]
  ): Promise<boolean> {
    return new Promise((res, rej) => {
      var data = this.database.fetch(`moderation-${id}`);
      data[key] = value;

      this.set(id, data);
      return res(true);
    });
  }

  /**
   * Method that Pushing Data to Something from Database
   *
   * @param {string} id Guild ID
   * @param {any} data Data to Push
   *
   * @returns {Promise<boolean>}
   */
  push(id: string, data: any): Promise<boolean> {
    return new Promise((res, rej) => {
      this.database.push(`moderation-${id}`, data);

      return res(true);
    });
  }

  /**
   * Method that Returns Value from Specified Key in Database
   *
   * @param {string} id Guild ID
   * @param {string} key Key to Get
   *
   * @returns {Promise<any>}
   */
  get<K extends keyof GuildData>(id: string, key: K): Promise<GuildData[K]> {
    return new Promise((res, rej) => {
      const data = this.database.fetch(`moderation-${id}`);
      const value = data[key];

      return res(value);
    });
  }

  /**
   * Method that Returns Data from Database
   *
   * @param {string} id Guild ID
   * @returns {Promise<GuildData>}
   */
  fetch(id: string): Promise<GuildData> {
    return new Promise((res, rej) => {
      const data = this.database.fetch(`moderation-${id}`);
      if (data === null) return res(null);

      return res(data);
    });
  }

  /**
   * Method that Removes Object from Array in Database
   *
   * @param {string} id Guild ID
   * @param {string} key Name of Array in Database
   * @param {string} second Property for Filter
   * @param {any} value Value for Filter
   *
   * @returns {Promise<any | boolean>}
   */
  remove(
    id: string,
    key: string,
    second: string,
    value: any
  ): Promise<any | boolean> {
    return new Promise((res, rej) => {
      const data = this.database.fetch(`moderation-${id}`);
      const prop = data[key];

      if (!Array.isArray(prop)) {
        return rej(this.logger.error(`"${key}" in DB isn't Array!`));
      }

      (prop as []).filter((x) => x[second] !== value);

      this.database.set(`moderation-${id}`, data);
      return res(true);
    });
  }
}
