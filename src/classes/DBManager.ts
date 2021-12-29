import { Client } from "discord.js";
import { GuildData, Options } from "../constants";
import { Logger } from "./Logger";
import Enmap from "enmap";

export declare interface DBManager {
  client: Client;
  options: Options;

  database: Enmap;
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
     * @type {Enmap}
     */
    this.database = new Enmap({
      name: "moderation",
      dataDir: this.options.dbPath,
      wal: false
    });
  }

  /**
   * Method that Changes Something from Database
   *
   * @param {id} id Discord Guild ID
   * @param {any} value Value to Set
   *
   * @returns {boolean}
   */
  set(id: string, value: any): boolean {
    this.database.set(`moderation-${id}`, value);

    return true;
  }

  /**
   * Method that Changes Property Value from Database
   *
   * @param {id} id Discord Guild ID
   * @param {string} key Property Name
   * @param {any} value Value to Set
   *
   * @returns {boolean}
   */
  setProp(id: string, key: string, value: any): boolean {
    var data = this.database.fetch(`moderation-${id}`);
    data[key] = value;

    this.set(id, data);

    return true;
  }

  /**
   * Method that Pushing Data to Something from Database
   *
   * @param {id} id Discord Guild ID
   * @param {any} data Data to Push
   *
   * @returns {boolean}
   */
  push(id: string, data: any): boolean {
    this.database.push(`moderation-${id}`, data);

    return true;
  }

  /**
   * Method that Returns Value from Specified Key in Database
   *
   * @param {id} id Discord Guild ID
   * @param {any} key Key to Get
   *
   * @returns {any}
   */
  get(id: string, key: string): any {
    const data = this.database.fetch(`moderation-${id}`);
    const value = data[key];

    return value;
  }

  /**
   * Method that Returns Data from Database
   *
   * @param {id} id Discord Guild ID
   * @returns {object}
   */
  fetch(id: string): GuildData {
    const data = this.database.fetch(`moderation-${id}`);

    return data;
  }

  /**
   * Method that Removes Object from Array in Database
   *
   * @param {id} id Discord Guild ID
   * @param {string} key Name of Array in Database
   * @param {string} second Property for Filter
   * @param {string} value Value for Filter
   *
   * @returns {any | boolean}
   */
  remove(
    id: string,
    key: string,
    second: string,
    value: string
  ): any | boolean {
    const data = this.database.fetch(`moderation-${id}`);

    if (!Array.isArray(data[key])) {
      return this.logger.error(`"${key}" in DB isn't Array!`);
    }

    const arr: any[] = data[key];
    arr.filter((x) => x[second] !== value);
    this.database.set(`moderation-${id}`, data);

    return true;
  }
}
