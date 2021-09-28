import { Client, GuildMember, Interaction, Message } from "discord.js";
import { Base } from "./Base";
import { MuteManager } from "./MuteManager";
import { Utils } from "./Utils";
import { Logger } from "./Logger";
import { Options, WarnsData } from "../constants";

export declare interface WarnManager {
  client: Client;
  options: Options;

  mutes: MuteManager;
  utils: Utils;
  logger: Logger;
}

/**
 * WarnManager Class
 *
 * @class
 * @classdesc Class that Handles/Creates/Removes Warns
 * @extends {Base}
 */
export class WarnManager extends Base {
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
  }

  /**
   * Get last Member Warn
   *
   * @param {GuildMember} member Discord Member
   * @returns {Promise<WarnsData | null>}
   */
  getWarn(member: GuildMember): Promise<WarnsData | null> {
    return new Promise(async (res, rej) => {
      if (!member)
        return rej(
          this.logger.warn('Specify "GuildMember" in WarnManager#getWarn!')
        );

      const data = await this.utils.getGuild(member.guild);
      const warns = data.warns.length;
      const lastWarn = data.warns[warns - 1];

      if (!lastWarn || lastWarn === undefined) return res(null);

      return res(lastWarn);
    });
  }

  /**
   * Method that creates Warn.
   *
   * @param {Message | Interaction} message Message or Interaction
   * @param {GuildMember} member Discord Member
   * @param {string} reason Warn Reason
   *
   * @fires Moderation#warnAdd
   * @fires Moderation#warnKick
   * @returns {Promise<WarnsData>}
   */
  create(
    message: Message | Interaction,
    member: GuildMember,
    reason?: string
  ): Promise<WarnsData> {
    return new Promise(async (res, rej) => {
      if (!message)
        return rej(
          this.logger.warn('Specify "Message" in WarnManager#create!')
        );
      if (!member)
        return rej(
          this.logger.warn('Specify "GuildMember" in WarnManager#create!')
        );
      if (!reason) reason = "No reason provided";

      const data = await this.utils.getGuild(member.guild);
      const warnData: WarnsData = {
        id: data.warns.length + 1,
        guildID: member.guild.id,
        memberID: member.id,
        moderatorID:
          message instanceof Message ? message.author.id : message.user.id,
        channelID:
          message instanceof Message ? message.channel.id : message.channel!.id,
        reason: reason,
      };

      data.warns.push(warnData);

      await this.utils.setData(member.guild, data);

      if (data.warns.length === 3) {
        await this.mutes.create(
          "tempmute",
          message,
          member,
          "User reached 3 warns | AutoMute.",
          3600000
        );

        this.emit("warnAdd", warnData);

        return res(warnData);
      } else if (data.warns.length === 6) {
        await member.kick("User reached 6 warns | AutoKick.").catch((err) => {
          return rej(this.logger.warn(err));
        });

        data.warns.filter((w: WarnsData) => w.memberID !== member.id);

        await this.utils.setData(member.guild, data);
        await this.emit("warnKick", warnData);

        return res(warnData);
      }
    });
  }

  /**
   * Method that removes last warn from member
   *
   * @param {GuildMember} member Discord Member
   *
   * @fires Moderation#warnRemove
   * @returns {Promise<WarnsData>}
   */
  delete(member: GuildMember): Promise<WarnsData> {
    return new Promise(async (res, rej) => {
      if (!member)
        return rej(
          this.logger.warn('Specify "GuildMember" in WarnManager#delete!')
        );

      const data = await this.utils.getGuild(member.guild);

      const lastWarn = await this.getWarn(member);
      if (!lastWarn)
        return rej(this.logger.warn("No Warn Data founded in Storage!"));

      const warnData: WarnsData = {
        id: lastWarn.id,
        guildID: member.guild.id,
        memberID: member.id,
        moderatorID: lastWarn.moderatorID,
        channelID: lastWarn.channelID,
        reason: lastWarn.reason,
      };

      this.emit("warnRemove", warnData);

      data.warns.filter((w: WarnsData) => w.id !== lastWarn.id);
      await this.utils.setData(member.guild, data);

      return res(warnData);
    });
  }

  /**
   * Method that returns all member warns
   *
   * @param {GuildMember} member Discord Member
   * @returns {Promise<WarnsData[] | null>}
   */
  all(member: GuildMember): Promise<WarnsData[] | null> {
    return new Promise(async (res, rej) => {
      if (!member)
        return rej(
          this.logger.warn('Specify "GuildMember" in WarnManager#all!')
        );

      const data = await this.utils.getGuild(member.guild);
      const warns = data.warns;

      if (!warns || warns.length) return res(null);
      else return res(warns);
    });
  }
}
