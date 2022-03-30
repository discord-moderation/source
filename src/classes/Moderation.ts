// Imports
import { SystemsManager } from "./SystemsManager";
import { GuildSystems } from "./modules/GuildSystems";
import { MuteManager } from "./MuteManager";
import { WarnManager } from "./WarnManager";
import { AutoRole } from "./AutoRole";
import { AntiSpam } from "./AntiSpam";
import { Options } from "../constants";
import { Logger } from "./Logger";
import { Utils } from "./Utils";
import { Base } from "./Base";

// Discord.JS
import { Client, TextChannel } from "discord.js";

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
   * Method that locks channel.
   *
   * @param {TextChannel} channel Text Channel
   * @param {string} [reason] Reason for lock
   *
   * @returns {Promise<boolean>}
   */
  lockdown(channel: TextChannel, reason?: string): Promise<boolean> {
    return new Promise((res, rej) => {
      if (!reason) reason = "No reason";

      return channel.permissionOverwrites
        .set(
          [
            {
              id: channel.guild.roles.everyone,
              deny: ["SEND_MESSAGES"],
            },
          ],
          reason
        )
        .then(() => {
          return res(true);
        })
        .catch((err) => {
          return rej(err.message);
        });
    });
  }

  /**
   * Method that unlocks channel.
   *
   * @param {TextChannel} channel Text Channel
   * @returns {Promise<boolean>}
   */
  unlock(channel: TextChannel): Promise<boolean> {
    return new Promise((res, rej) => {
      return channel.permissionOverwrites
        .set([
          {
            id: channel.guild.roles.everyone,
            allow: ["SEND_MESSAGES"],
          },
        ])
        .then(() => {
          return res(true);
        })
        .catch((err) => {
          return rej(err.message);
        });
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
