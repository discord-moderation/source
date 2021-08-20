// Imports
import { Base } from "./Base";
import { Utils } from "./Utils";
import { MuteManager } from "./MuteManager";
import { WarnManager } from "./WarnManager";
import { Options, MuteTypes, MutesData, WarnsData } from "../constants";
import ModeratorError from "./ModeratorError";

// Discord.JS
import { Client, GuildMember, Message } from "discord.js";

export declare interface Moderation {
  client: Client;
  options: Options;

  // Classes
  utils: Utils;
  mutes: MuteManager;
  warns: WarnManager;

  // Other
  isReady: boolean;
}

/**
 * Main Moderation Class
 *
 * @class
 * @classdesc Class that enables Moderation System
 * @extends {Base}
 */
export class Moderation extends Base {
  /**
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
     * MuteManager Class
     * @type {MuteManager}
     */
    this.mutes = new MuteManager(this.client, this.options);

    /**
     * WarnManager Class
     * @type {WarnManager}
     */
    this.warns = new WarnManager(this.client, this.options);

    /**
     * Module Utils
     * @type {Utils}
     */
    this.utils = new Utils(this.client, this.options);

    /**
     * Module Ready State
     * @type {boolean}
     */
    this.isReady = false;

    if (this.options.storageType === "json") this.utils.checkFile();

    this.client.on("ready", async () => {
      await this.utils.checkMutes();
    });

    this.client.on("guildMemberAdd", async (member) => {
      await this.utils.checkMute(member);
    });
  }

  /**
   * Method that Mutes or Temp Mutes Member
   *
   * @param {string} type Type of the Mute
   * @param {Message} message Discord Message
   * @param {GuildMember} member Member to Mute
   * @param {string} reason Reason of the Mute
   * @param {number} time Time of the Temp Mute
   *
   * @returns {Promise<MutesData>}
   * @emits Moderation#muteMember
   */
  mute(
    type: MuteTypes,
    message: Message,
    member: GuildMember,
    reason?: string,
    time?: number
  ): Promise<MutesData> {
    return new Promise(async (res, rej) => {
      if (!["mute", "tempmute"].includes(type))
        throw new ModeratorError(
          "INVALID_TYPE",
          ["mute", "tempmute"],
          type,
          "mute#type"
        );
      if (type === "tempmute" && time === undefined)
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "Number",
          "undefined",
          "mute#time"
        );

      return res(await this.mutes.create(type, message, member, reason, time));
    });
  }

  /**
   * Method that unmutes Member
   *
   * @param {GuildMember} member Member for Mute
   *
   * @returns {Promise<MutesData>}
   * @emits Moderation#unmuteMember
   */
  unmute(member: GuildMember): Promise<MutesData> {
    return new Promise(async (res, rej) => {
      if (!member)
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "GuildMember",
          "undefined",
          "unmute#member"
        );

      return res(await this.mutes.delete(member));
    });
  }

  /**
   * Method that warns Member
   *
   * @param {Message} message Discord Message
   * @param {GuildMember} member Member for Warn
   * @param {string} reason Reaon of the Warn
   *
   * @fires Moderation#warnAdd
   * @fires Moderation#warnKick
   * @returns {Promise<WarnsData>}
   */
  warn(
    message: Message,
    member: GuildMember,
    reason?: string
  ): Promise<WarnsData> {
    return new Promise(async (res, rej) => {
      if (!message)
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "Message",
          "undefined",
          "warn#message"
        );
      if (!member)
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "GuildMember",
          "undefined",
          "warn#member"
        );
      if (!reason) reason = "No reason provided.";

      return res(this.warns.create(message, member, reason));
    });
  }

  /**
   * Method that removes last warn from Member
   *
   * @param {GuildMember} member Member for Warn
   *
   * @fires Moderation#warnRemove
   * @returns {Promise<WarnsData>}
   */
  unwarn(member: GuildMember): Promise<WarnsData> {
    return new Promise(async (res, rej) => {
      if (!member)
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "GuildMember",
          "undefined",
          "unwarn#member"
        );

      return res(await this.warns.delete(member));
    });
  }

  /**
   * Method that removes last warn from Member
   *
   * @param {GuildMember} member Member for Warn
   * @returns {Promise<WarnsData[] | undefined>}
   */
  allWarns(member: GuildMember): Promise<WarnsData[] | undefined> {
    return new Promise(async (res, rej) => {
      if (!member)
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "GuildMember",
          "undefined",
          "warns#member"
        );

      const warns = await this.warns.all(member);
      if (warns === null) return res(undefined);

      return res(warns);
    });
  }
}
