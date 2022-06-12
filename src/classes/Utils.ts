import { Client, Guild, GuildMember, Invite } from "discord.js";
import { Options, GuildData, defaultOptions } from "../constants";
import { DBManager } from "./DBManager";
import { Logger } from "./Logger";
import { Base } from "./Base";

export interface Utils {
  client: Client;
  options: Options;

  database: DBManager;
  logger: Logger;
}

/**
 * Utils Class
 *
 * @class
 * @classdesc Class that including some methods.
 * @extends {Base}
 */
export class Utils extends Base {
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
     * Database
     * @type {DBManager}
     */
    this.database = new DBManager(this.client, this.options);

    /**
     * Module Logger
     * @type {Logger}
     */
    this.logger = new Logger();
  }

  /**
   * Method that will return Guild Data
   *
   * @param {Guild} guild Discord Guild
   * @returns {Promise<GuilData>}
   */
  getGuild(guild: Guild): Promise<GuildData> {
    return new Promise(async (res, rej) => {
      if (!guild) {
        return rej(this.logger.warn('Specify "Guild" in Utils#getGuild'));
      }

      var data: GuildData = await this.database.fetch(guild.id);
      if (data === null) {
        data = await this.createGuild(guild);
      }

      return res(data);
    });
  }

  /**
   * Method that created Guild Data
   *
   * @param {Guild} guild - Discord Guild
   * @returns {Promise<boolean>}
   */
  createGuild(guild: Guild): Promise<GuildData> {
    return new Promise(async (res, rej) => {
      if (!guild) {
        return rej(this.logger.warn('Specify "Guild" in Utils#createGuild'));
      }

      const data = await this.database.fetch(guild.id);
      if (data !== null) return res(data);

      this.database.set(guild.id, {
        guildID: guild.id,
        muteRole: null,
        autoRole: null,
        warns: [],
        mutes: [],
        immunityUsers: [],
        systems: {
          antiInvite: false,
          antiJoin: false,
          antiLink: false,
          antiSpam: false,
          autoRole: false,
          ghostPing: false,
        },
      });

      return res(await this.database.fetch(guild.id));
    });
  }

  /**
   * Method that changes data in Storage
   *
   * @param {Guild} guild Discord Guild
   * @param {GuildData} newData New Guild Data
   * @returns {Promise<boolean>}
   */
  setData(guild: Guild, newData: GuildData): Promise<boolean> {
    return new Promise(async (res, rej) => {
      await this.getGuild(guild);
      this.database.set(guild.id, newData);

      return res(true);
    });
  }

  /**
   * Method that checks mutes when client is ready
   *
   * @returns {Promise<boolean>}
   */
  checkMutes(): Promise<boolean> {
    return new Promise(async (res, rej) => {
      for (const [id, guild] of this.client.guilds.cache) {
        var data = await this.database.fetch(guild.id);
        if (data === null) {
          await this.createGuild(guild);
          data = await this.database.fetch(guild.id);
        }

        if (!data.mutes) continue;

        for (let i = 0; i < data.mutes.length; i++) {
          const mute = data.mutes[i];

          if (mute.type === "mute") continue;
          if (data.muteRole === null) continue;

          const muteRole = guild.roles.cache.get(data.muteRole);
          if (!muteRole) {
            return rej(
              this.logger.warn(`Mute Role in "${guild.name}" isn't found!`)
            );
          }

          const member = guild.members.cache.get(mute.memberID);
          if (!member) {
            return rej(
              this.logger.warn(
                `Member with ID "${mute.memberID}" isn't found in server!`
              )
            );
          }

          if (!mute.unmutedAt) continue;
          else if (Date.now() > mute.unmutedAt) {
            var newMutes = data.mutes.filter((m) => m.memberID !== member.id);
            await this.database.setProp(guild.id, "mutes", newMutes);

            await member.roles
              .remove(muteRole)
              .then(() => {
                mute.unmutedAt = Date.now();
                this.emit("unmuteMember", mute);
              })
              .catch((err) => {
                return rej(this.logger.error(err.message));
              });
          } else {
            const delay = mute.unmutedAt - Date.now();

            setTimeout(async () => {
              await member.roles
                .remove(muteRole)
                .then(() => {
                  mute.unmutedAt = Date.now();
                  this.emit("unmuteMember", mute);
                })
                .catch((err) => {
                  return rej(this.logger.error(err.message));
                });
            }, delay);
          }
        }

        return res(true);
      }
    });
  }

  /**
   * Method that create Timeout with Promise
   *
   * @param {number} ms Milliseconds
   * @returns {Promise<unknown>}
   */
  wait(ms: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * @returns {Promise<boolean>}
   */
  checkOptions(): Promise<boolean> {
    return new Promise(async (res, rej) => {
      var options = this.options;
      if (typeof options === "undefined") this.options = defaultOptions;

      return res(true);
    });
  }

  /**
   * Method that checks User Immunity.
   *
   * @param {GuildMember | Invite} target Discord Member or Invite
   * @returns {Promise<boolean>}
   */
  checkImmunity(target: GuildMember | Invite): Promise<boolean> {
    return new Promise(async (res, rej) => {
      if (!target.guild) return;

      const data = await this.getGuild(target.guild as Guild);
      const immunityUsers = data.immunityUsers;
      const user = immunityUsers.find(
        (m) => m.memberID === (target as GuildMember).id
      );

      if (!user) return res(false);
      else return res(true);
    });
  }
}
