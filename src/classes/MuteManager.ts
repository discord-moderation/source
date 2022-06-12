import {
  Client,
  Guild,
  GuildMember,
  Interaction,
  Message,
  Role,
} from "discord.js";
import { Options, MuteTypes, MutesData, ReturnObject } from "../constants";
import { Logger } from "./Logger";
import { Utils } from "./Utils";
import { Base } from "./Base";

export interface MuteManager {
  client: Client;
  options: Options;

  logger: Logger;
  utils: Utils;
}

/**
 * MuteManager Class
 *
 * @class
 * @classdesc Class that Handles/Creates/Removes Mutes
 * @extends {Base}
 */
export class MuteManager extends Base {
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
     * Module Logger
     * @type {Logger}
     */
    this.logger = new Logger();

    /**
     * Module Utils
     * @type {Utils}
     */
    this.utils = new Utils(this.client, this.options);
  }

  /**
   * This method sets Mute Role.
   *
   * @param {Guild} guild Discord Guild
   * @param {Role} role Discord Role
   * @returns {Promise<boolean>}
   */
  setRole(guild: Guild, role: Role): Promise<boolean> {
    return new Promise(async (res, rej) => {
      if (!role) {
        return rej(this.logger.warn('Specify "Role" in MuteManager#setRole'));
      }

      await this.utils.getGuild(guild);
      this.utils.database.setProp(guild.id, "muteRole", role.id);

      return res(true);
    });
  }

  /**
   * This method getting Mute Role.
   *
   * @param {Guild} guild Discord Guild
   * @returns {Promise<boolean>}
   */
  getRole(guild: Guild): Promise<null | Role> {
    return new Promise(async (res, rej) => {
      if (!guild) {
        return rej(this.logger.warn('Specify "Guild" in MuteManager#getRole'));
      }

      const data = await this.utils.getGuild(guild);
      if (data.muteRole === null) return res(null);

      const role = guild.roles.cache.get(data.muteRole);
      if (!role) return res(null);

      return res(role);
    });
  }

  /**
   * Method that finds Mute in Storage
   *
   * @param {GuildMember} member Discord Member
   * @returns {Promise<MutesData>}
   */
  getMute(member: GuildMember): Promise<MutesData | null> {
    return new Promise(async (res, rej) => {
      if (!member) {
        return rej(
          this.logger.error('Specify "GuildMember" in MuteManager#getMute')
        );
      }

      const data = await this.utils.getGuild(member.guild);
      const mute = data.mutes.find((x) => x.memberID === member.id);

      if (mute) return res(mute);
      else return res(null);
    });
  }

  /**
   * This is method that mutes member.
   *
   * @param {string} type Mute Type
   * @param {Message | Interaction} message Message or Interaction
   * @param {GuildMember} member Discord Guild Member
   * @param {string} reason Reason of the Mute
   * @param {number} time Time of Temp Mute
   *
   * @fires Moderation#muteMember
   * @returns {Promise<ReturnObject | MutesData>}
   */
  create(
    type: MuteTypes,
    message: Message | Interaction,
    member: GuildMember,
    reason?: string,
    time?: number
  ): Promise<MutesData | ReturnObject> {
    return new Promise(async (res, rej) => {
      if (!type) {
        return rej(this.logger.warn('Specify "type" in MuteManager#create'));
      }

      if (!message) {
        return rej(this.logger.warn('Specify "message" in MuteManager#create'));
      }

      if (!member) {
        return rej(this.logger.warn('Specify "member" in MuteManager#create'));
      }

      if (!reason) reason = "No reason provided.";

      if (type === "tempmute" && time === undefined) {
        return rej(
          this.logger.warn(
            'No "time" specified in MuteManager#create (tempmute)'
          )
        );
      }

      const mute = await this.getMute(member);
      if (mute !== null) {
        return res({
          status: false,
          message: "Member already has Mute!",
        });
      }

      if (!message.guild) return;
      const data = await this.utils.getGuild(message.guild);
      const role = await this.getRole(message.guild);
      if (role === null) return;

      var muteData: MutesData = {
        id: data.mutes.length + 1,
        type,
        guildID: message.guild.id,
        memberID: member.id,
        moderatorID:
          message instanceof Message ? message.author.id : message.user.id,
        channelID:
          message instanceof Message ? message.channel.id : message.channel!.id,
        reason,
      };

      if (type === "tempmute") {
        muteData = {
          ...muteData,
          time,
          unmutedAt: Date.now() + time,
        };
      }

      await member.roles
        .add(role)
        .then(async () => {
          data.mutes.push(muteData);
          this.utils.database.set(message.guild.id, data);

          this.emit("muteMember", muteData);

          res(muteData);

          if (type === "tempmute") {
            await this.handleMute(message.guild, member, time, muteData);
          }
        })
        .catch((err) => {
          return res({
            status: false,
            message: err.message,
          });
        });
    });
  }

  /**
   * Method that removes Mute from Member
   *
   * @param {GuildMember} member Discord Member
   *
   * @fires Moderation#unmuteMember
   * @returns {Promise<ReturnObject | MutesData>}
   */
  delete(member: GuildMember): Promise<ReturnObject | MutesData> {
    return new Promise(async (res, rej) => {
      const mute = await this.getMute(member);

      if (mute === null) {
        return res({
          status: false,
          message: "Member hasn't any Mute!",
        });
      } else {
        const data = await this.utils.getGuild(member.guild);
        const role = await this.getRole(member.guild);
        if (!role) {
          return res({
            status: false,
            message: "Server hasn't any Mute Role!",
          });
        }

        const roleCheck = member.roles.cache.find((r) => r.id === role.id);
        if (!roleCheck) {
          return res({
            status: false,
            message: "Member hasn't Mute Role!",
          });
        }

        return await member.roles
          .remove(role)
          .then(async () => {
            this.emit("unmuteMember", mute);

            await this.utils.database.setProp(
              member.guild.id,
              "mutes",
              data.mutes.filter((muteData) => muteData.guildID !== mute.guildID)
            );

            return res(mute);
          })
          .catch((err) => {
            return res({
              status: false,
              message: err.message,
            });
          });
      }
    });
  }

  /**
   * Private method that will handle Mute
   *
   * @param {Guild} guild Discord Guild
   * @param {GuildMember} member Guild Member
   * @param {number} time Time of the Mute
   * @param {MutesData} muteData Mute Data
   * @returns {Promise<ReturnObject | boolean>}
   *
   * @emits Moderation#muteMember
   */
  handleUtilsMute(member: GuildMember): Promise<ReturnObject | boolean> {
    return new Promise(async (res, rej) => {
      const data = await this.utils.getGuild(member.guild);
      if (data.muteRole === null) return res(false);

      const lastMute = await this.getMute(member);
      if (lastMute?.channelID === undefined) return res(false);

      const role = await this.getRole(member.guild);
      if (!role) return res(false);

      if (this.client?.user?.id === undefined) return res(false);

      const muteData: MutesData = {
        id: data.mutes.length + 1,
        type: lastMute.type,
        guildID: member.guild.id,
        memberID: member.id,
        moderatorID: this.client.user.id,
        channelID: lastMute.channelID,
        reason: "User rejoined server.",
        time: lastMute.type === "tempmute" ? lastMute.time : null,
        unmutedAt: lastMute.type === "tempmute" ? lastMute.unmutedAt : null,
      };

      data.mutes.filter((m) => m.memberID !== member.id);
      data.mutes.push(muteData);

      await this.utils.database.set(member.guild.id, data);
      await member.roles
        .add(role)
        .then(() => {
          this.emit("muteMember", muteData);
          return res(true);
        })
        .catch((err) => {
          return res({
            status: false,
            message: err.message,
          });
        });
    });
  }

  /**
   * Private method that will handle Mute
   *
   * @param {Guild} guild Discord Guild
   * @param {GuildMember} member Guild Member
   * @param {number} time Time of the Mute
   * @param {MutesData} muteData Mute Data
   *
   * @returns {Promise<ReturnObject | null | boolean>}
   * @emits Moderation#unmuteMember
   */
  private handleMute(
    guild: Guild,
    member: GuildMember,
    time: number,
    muteData: MutesData
  ): Promise<ReturnObject | null | boolean> {
    return new Promise(async (res, rej) => {
      var data = await this.utils.getGuild(guild);
      if (data.muteRole === null) return res(null);

      const role = guild.roles.cache.get(data.muteRole);
      if (!role) return res(null);

      const mute = await this.getMute(member);
      if (!mute) return res(null);

      setTimeout(async () => {
        await member.roles
          .remove(role)
          .then(async () => {
            this.emit("unmuteMember", muteData);
            return res(true);
          })
          .catch((err) => {
            return res({
              status: false,
              message: err.message,
            });
          });

        data.mutes.filter((m) => m.id !== mute.id);
        await this.utils.database.set(guild.id, data);
      }, time);
    });
  }
}
