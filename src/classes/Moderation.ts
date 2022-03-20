// Imports
import { Options, MuteTypes, MutesData, WarnsData } from "../constants";
import { SystemsManager } from "./SystemsManager";
import { GuildSystems } from "./modules/GuildSystems";
import { MuteManager } from "./MuteManager";
import { WarnManager } from "./WarnManager";
import { AutoRole } from "./AutoRole";
import { AntiSpam } from "./AntiSpam";
import { Logger } from "./Logger";
import { Utils } from "./Utils";
import { Base } from "./Base";
import ModeratorError from "./ModeratorError";

// Discord.JS
import { Client, GuildMember, Interaction, Message } from "discord.js";

export interface Moderation {
  client: Client;
  options: Options;

  // Classes and Systems
  utils: Utils;
  mutes: MuteManager;
  warns: WarnManager;
  guildSystems: GuildSystems;
  systems: SystemsManager;
  autoRole: AutoRole;
  antiSpam: AntiSpam;
  logger: Logger;

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
     * Auto-Role System
     * @type {AutoRole}
     */
    this.autoRole = new AutoRole(this.client, this.options);

    /**
     * Anti-Spam System
     * @type {AntiSpam}
     */
    this.antiSpam = new AntiSpam(this.client, this.options);

    /**
     * Systems Manager
     * @type {SystemsManager}
     */
    this.systems = new SystemsManager(this.client, this.options);

    /**
     * Module Systems
     * @type {SystemsManager}
     */
    this.guildSystems = new GuildSystems(this.client, this.options);

    /**
     * Module Ready State
     * @type {boolean}
     */
    this.isReady = false;

    this._init();
  }

  /**
   * @private
   */
  private _init(): Promise<boolean> {
    return new Promise((res, rej) => {
      this.utils.checkOptions();

      this.client.on("ready", () => {
        this.utils.checkMutes();
      });

      this.isReady = true;
    });
  }

  /**
   * Method that Mutes or Temp Mutes Member
   *
   * @param {string} type Type of the Mute
   * @param {Message | Interaction} message Message or Interaction
   * @param {GuildMember} member Member to Mute
   * @param {string} [reason] Reason of the Mute
   * @param {number} [time] Time of the Temp Mute
   *
   * @returns {Promise<MutesData>}
   * @emits Moderation#muteMember
   */
  mute(
    type: MuteTypes,
    message: Message | Interaction,
    member: GuildMember,
    reason?: string,
    time?: number
  ): Promise<MutesData> {
    return new Promise(async (res, rej) => {
      if (!["mute", "tempmute"].includes(type)) {
        throw new ModeratorError(
          "INVALID_TYPE",
          ["mute", "tempmute"],
          type,
          "mute#type"
        );
      }

      if (type === "tempmute" && !time) {
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "Number",
          "undefined",
          "mute#time"
        );
      }

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
      if (!member) {
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "GuildMember",
          "undefined",
          "unmute#member"
        );
      }

      return res(await this.mutes.delete(member));
    });
  }

  /**
   * Method that warns Member
   *
   * @param {Message | Interaction} message Message or Interaction
   * @param {GuildMember} member Member for Warn
   * @param {string} [reason] Reaon of the Warn
   *
   * @fires Moderation#warnAdd
   * @fires Moderation#warnKick
   * @returns {Promise<WarnsData>}
   */
  warn(
    message: Message | Interaction,
    member: GuildMember,
    reason?: string
  ): Promise<WarnsData> {
    return new Promise(async (res, rej) => {
      if (!message) {
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "Message",
          "undefined",
          "warn#message"
        );
      }

      if (!member) {
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "GuildMember",
          "undefined",
          "warn#member"
        );
      }

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
      if (!member) {
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "GuildMember",
          "undefined",
          "unwarn#member"
        );
      }

      return res(await this.warns.delete(member));
    });
  }

  /**
   * Method that removes last warn from Member
   *
   * @param {GuildMember} member Member for Warn
   * @returns {Promise<WarnsData[] | null>}
   */
  allWarns(member: GuildMember): Promise<WarnsData[] | null> {
    return new Promise(async (res, rej) => {
      if (!member) {
        throw new ModeratorError(
          "UNDEFINED_VALUE",
          "GuildMember",
          "undefined",
          "warns#member"
        );
      }

      const warns = await this.warns.all(member);
      if (warns === null) return res(null);

      return res(warns);
    });
  }
}

/**
 * @event Moderation#muteMember
 *
 * @type {object}
 * @param {number} id ID of the Mute
 * @param {string} type Type of the Mute
 * @param {string} guildID ID of the Guild
 * @param {string} memberID ID of the Muted Member
 * @param {string} moderatorID ID of the Moderator
 * @param {string} channelID ID of the Channel
 * @param {string} reason Reason of the Mute
 * @param {number} [time] Time of the Mute
 * @param {number} [unmutedAt] Unmuting Date
 */

/**
 * @event Moderation#unmuteMember
 *
 * @type {object}
 * @param {number} id ID of the Mute
 * @param {string} type Type of the Mute
 * @param {string} guildID ID of the Guild
 * @param {string} memberID ID of the Muted Member
 * @param {string} moderatorID ID of the Moderator
 * @param {string} channelID ID of the Channel
 * @param {string} reason Reason of the Mute
 * @param {number} [time] Time of the Mute
 * @param {number} [unmutedAt] Unmuting Date
 */

/**
 * @event Moderation#warnAdd
 *
 * @type {object}
 * @param {number} id ID of the Warn
 * @param {string} guildID ID of the Guild
 * @param {string} memberID ID of the Warned Member
 * @param {string} moderatorID ID of the Moderator
 * @param {string} channelID ID of the Channel
 * @param {string} reason Reason of the Mute
 */

/**
 * @event Moderation#warnRemove
 *
 * @type {object}
 * @param {number} id ID of the Warn
 * @param {string} guildID ID of the Guild
 * @param {string} memberID ID of the Warned Member
 * @param {string} moderatorID ID of the Moderator
 * @param {string} channelID ID of the Channel
 * @param {string} reason Reason of the Mute
 */

/**
 * @event Moderation#warnKick
 *
 * @type {object}
 * @param {string} guildID ID of the Guild
 * @param {string} memberID ID of the Warned Member
 * @param {string} moderatorID ID of the Moderator
 * @param {string} channelID ID of the Channel
 * @param {string} reason Reason of the Mute
 */
