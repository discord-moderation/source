import { Options, ReturnObject } from "../constants";
import { Client, Message } from "discord.js";
import { SystemsManager } from "./SystemsManager";
import { MuteManager } from "./MuteManager";
import { Logger } from "./Logger";
import { Utils } from "./Utils";

interface userMap {
  msgCount: number;
  lastMessage: Message;
  timer: NodeJS.Timeout;
}

export interface AntiSpam {
  client: Client;
  options: Options;

  systems: SystemsManager;
  mutes: MuteManager;
  utils: Utils;
  logger: Logger;

  usersMap: Map<string, userMap>;
}

/**
 * Class that controls Anti-Spam System
 *
 * @class
 * @classdesc Anti-Spam System
 */
export class AntiSpam {
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
     * Mute Manager
     * @type {MuteManager}
     */
    this.mutes = new MuteManager(this.client, this.options);

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

    /**
     * Users Map
     * @type {Map<string, userMap>}
     */
    this.usersMap = new Map();
  }

  /**
   * Method that handles Anti-Spam System.
   *
   * @param {Message} message Message
   * @returns {Promise<ReturnObject | boolean>}
   */
  handle(message: Message): Promise<ReturnObject | boolean> {
    return new Promise(async (res, rej) => {
      if (!message) {
        return rej(this.logger.warn('Specify "Message" in AntiSpam#_handle!'));
      }

      if (!message.guild) return;
      if (!message.member) return;

      const status = await this.systems.status(message.guild, "antiSpam");
      if (!status) {
        return res({
          status: false,
          message: `AntiSpam is disabled in the guild with ID "${message.guild.id}"!`,
        });
      }

      const { muteRole } = await this.utils.getGuild(message.guild);
      if (!muteRole) {
        return res({
          status: false,
          message: `Guild "${message.guild.id}" hasn't a Mute Role!`,
        });
      }

      const role = message.guild.roles.cache.get(muteRole);
      if (!role) {
        return res({
          status: false,
          message: `Mute Role with ID "${muteRole}" isn't found in the Guild!`,
        });
      }

      const LIMIT = 7;
      const TIME = 15000;
      const DIFF = 5000;

      if (this.usersMap.has(message.author.id)) {
        const userData = this.usersMap.get(message.author.id);
        if (!userData) return;

        const { lastMessage, timer } = userData;
        const difference =
          message.createdTimestamp - lastMessage.createdTimestamp;

        var msgCount = userData.msgCount;

        if (difference > DIFF) {
          clearTimeout(timer);

          userData.msgCount = 1;
          userData.lastMessage = message;
          userData.timer = setTimeout(() => {
            this.usersMap.delete(message.author.id);
          }, TIME);

          this.usersMap.set(message.author.id, userData);
        } else {
          ++msgCount;

          if (Number(msgCount) === LIMIT) {
            return this.mutes.create(
              "tempmute",
              message,
              message.member,
              "Anti-Spam System.",
              3600000
            );
          } else {
            userData.msgCount = msgCount;

            this.usersMap.set(message.author.id, userData);
          }
        }
      } else {
        const timeOut = setTimeout(() => {
          this.usersMap.delete(message.author.id);
        }, TIME);

        this.usersMap.set(message.author.id, {
          msgCount: 1,
          lastMessage: message,
          timer: timeOut,
        });
      }

      return res(true);
    });
  }
}
