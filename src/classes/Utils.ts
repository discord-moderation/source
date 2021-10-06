import { Client, Guild, GuildMember, Invite, MessageEmbed } from "discord.js";
import {
  Options,
  GuildData,
  defaultOptions,
  ActionTypes,
  MutesData,
  WarnsData,
} from "../constants";
import { Logger } from "./Logger";
import { Base } from "./Base";
import { version } from "../../package.json";
import { DBManager } from "./DBManager";
import fetch from "node-fetch";
import ms from "ms";

export declare interface Utils {
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
      if (!guild)
        return rej(this.logger.warn('Specify "Guild" in Utils#getGuild'));

      var data: GuildData = this.database.fetch(guild.id);

      if (data === undefined || data === null) {
        this.createGuild(guild);

        data = this.database.fetch(guild.id);
      } else return res(data);
    });
  }

  /**
   * Method that created Guild Data
   *
   * @param {Guild} guild - Discord Guild
   * @returns {Promise<boolean>}
   */
  createGuild(guild: Guild): Promise<boolean> {
    return new Promise(async (res, rej) => {
      if (!guild)
        return rej(this.logger.warn('Specify "Guild" in Utils#createGuild'));

      const data = this.database.fetch(guild.id);

      if (data === undefined || data === null) {
        this.database.set(guild.id, {
          guildID: guild.id,
          muteRole: null,
          autoRole: null,
          warns: [],
          mutes: [],
          immunityUsers: [],
        });

        return res(true);
      } else {
        return rej(
          this.logger.warn(
            `Guild with name "${guild.name}" already placed in DB.`
          )
        );
      }
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
      if (!guild)
        return rej(this.logger.warn('Specify "Guild" in Utils#setData!'));
      if (!newData)
        return rej(this.logger.error('Specify "GuildData" in Utils#setData!'));

      await this.getGuild(guild);
      this.database.set(guild.id, newData);

      return res(true);
    });
  }

  /**
   * Method that created Log Embed
   *
   * @param {ActionTypes} action Type of the Action
   * @param {GuildMember} member Discord Member
   * @param {MutesData | WarnsData} data Warn or Mute Data
   *
   * @returns {Promise<GuildMember>}
   */
  logEmbed(
    action: ActionTypes,
    member: GuildMember,
    muteData?: MutesData | null,
    warnData?: WarnsData | null
  ): Promise<MessageEmbed> {
    return new Promise(async (res, rej) => {
      const embed = new MessageEmbed();
      const caseID = await (await this.getGuild(member.guild)).cases;

      switch (action) {
        case "Ban": {
          const data = await member.guild.fetchAuditLogs({
            type: "MEMBER_BAN_ADD",
            limit: 1,
          });
          const info = data.entries.first();

          embed.setColor("RED");
          embed.setTitle(`New Case [ID: ${caseID}]`);
          embed.setDescription(
            [
              `› **Type**: **Member Ban**`,
              `› **Member**: **${member}**`,
              `› **Moderator**: **${info?.target}**`,
              `› **Reason**: **${info?.reason || "No reason provided."}**`,
              `› **Banned At**: **${new Date(
                info?.createdTimestamp || Date.now()
              ).toLocaleString(this.options.locale)}**`,
            ].join("\n")
          );
        }

        case "Kick": {
          const data = await member.guild.fetchAuditLogs({
            type: "MEMBER_KICK",
            limit: 1,
          });
          const info = data.entries.first();

          embed.setColor("RED");
          embed.setTitle(`New Case [ID: ${caseID}]`);
          embed.setDescription(
            [
              `› **Type**: **Member Kick**`,
              `› **Member**: **${member}**`,
              `› **Moderator**: **${info?.target}**`,
              `› **Reason**: **${info?.reason || "No reason provided."}**`,
              `› **Kicked At**: **${new Date(
                info?.createdTimestamp || Date.now()
              ).toLocaleString(this.options.locale)}**`,
            ].join("\n")
          );
        }

        case "Mute": {
          const { mutes } = await this.getGuild(member.guild);
          const info = mutes.find((mute) => mute.memberID === member.id);

          const moderator = member.guild.members.cache.get(
            String(info?.moderatorID)
          );
          const channel = member.guild.channels.cache.get(
            String(info?.channelID)
          );

          embed.setColor("RED");
          embed.setTitle(`New Case [ID: ${caseID}]`);
          embed.setDescription(
            [
              `› **Type**: **Member Warn**`,
              `› **Member**: **${member}**`,
              `› **Moderator**: **${moderator}**`,
              `› **Channel**: **${channel}**`,
              `› **Reason**: **${info?.reason || "No reason provided."}**`,
              `› **Muted At**: **${new Date().toLocaleString(
                this.options.locale
              )}**`,
            ].join("\n")
          );
        }

        case "TempMute": {
          const { mutes } = await this.getGuild(member.guild);
          const info = mutes.find((mute) => mute.memberID === member.id);

          const moderator = member.guild.members.cache.get(
            String(info?.moderatorID)
          );
          const channel = member.guild.channels.cache.get(
            String(info?.channelID)
          );

          const muteTime = ms(Number(info?.time));
          const unmutedAt = new Date(Number(info?.unmutedAt)).toLocaleString(
            this.options.locale
          );

          embed.setColor("RED");
          embed.setTitle(`New Case [ID: ${caseID}]`);
          embed.setDescription(
            [
              `› **Type**: **Member Mute**`,
              `› **Member**: **${member}**`,
              `› **Moderator**: **${moderator}**`,
              `› **Channel**: **${channel}**`,
              `› **Reason**: **${info?.reason || "No reason provided."}**`,
              ``,
              `› **Mute Time**: **${muteTime}**`,
              `› **Muted At**: **${new Date().toLocaleString(
                this.options.locale
              )}**`,
              `› **Unmuted At**: **${unmutedAt}**`,
            ].join("\n")
          );
        }

        case "UnMute": {
          const moderator = member.guild.members.cache.get(
            String(muteData?.moderatorID)
          );
          const channel = member.guild.channels.cache.get(
            String(muteData?.channelID)
          );

          const muteTime = ms(muteData?.time || 0);
          const unmutedAt = new Date(
            muteData?.unmutedAt || Date.now()
          ).toLocaleString(this.options.locale);

          embed.setColor("RED");
          embed.setTitle(`New Case [ID: ${caseID}]`);
          embed.setDescription(
            [
              `› **Type**: **Member UnMute [${muteData?.type}]**`,
              `› **Member**: **${member}**`,
              `› **Moderator**: **${moderator}**`,
              `› **Channel**: **${channel}**`,
              `› **Reason**: **${muteData?.reason || "No reason provided."}**`,
              ``,
              `› **Mute Time**: **${muteTime}**`,
              `› **Unmuted At**: **${unmutedAt}**`,
            ].join("\n")
          );
        }

        case "Warn": {
          const { warns } = await this.getGuild(member.guild);
          const warnsLegth = warns.length;
          const lastWarn = warns[warnsLegth - 1];

          const moderator = member.guild.members.cache.get(
            String(lastWarn?.moderatorID)
          );
          const channel = member.guild.channels.cache.get(
            String(lastWarn?.channelID)
          );

          embed.setColor("YELLOW");
          embed.setDescription(
            [
              `› **Type**: **Member Warn**`,
              `› **Member**: **${member}**`,
              `› **Moderator**: **${moderator}**`,
              `› **Channel**: **${channel}**`,
              `› **Reason**: **${lastWarn?.reason || "No reason provided."}**`,
              `› **Warned At**: **${new Date(Date.now()).toLocaleString(
                this.options.locale
              )}**`,
            ].join("\n")
          );
        }

        case "UnWarn": {
          const moderator = member.guild.members.cache.get(
            String(warnData?.moderatorID)
          );
          const channel = member.guild.channels.cache.get(
            String(warnData?.channelID)
          );

          embed.setColor("YELLOW");
          embed.setDescription(
            [
              `› **Type**: **Member UnWarn**`,
              `› **Member**: **${member}**`,
              `› **Moderator**: **${moderator}**`,
              `› **Channel**: **${channel}**`,
              `› **Reason**: **${warnData?.reason || "No reason provided."}**`,
              `› **UnWarned At**: **${new Date(Date.now()).toLocaleString(
                this.options.locale
              )}**`,
            ].join("\n")
          );
        }
      }

      return embed;
    });
  }

  /**
   * Method that checks mutes when client is ready
   *
   * @returns {Promise<boolean>}
   */
  checkMutes(): Promise<boolean> {
    return new Promise(async (res, rej) => {
      return this.client.guilds.cache.forEach(async (guild) => {
        const data = await this.getGuild(guild);
        if (!data.mutes.length) return;

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

          if (mute.unmutedAt === undefined) continue;

          if (Date.now() > mute.unmutedAt) {
            await member.roles.remove(muteRole).catch((err) => {
              return rej(this.logger.error(err.message));
            });

            mute.unmutedAt = Date.now();

            this.emit("unmuteMember", mute);
          } else {
            const delay = mute.unmutedAt - Date.now();

            setTimeout(async () => {
              await member.roles.remove(muteRole).catch((err) => {
                return rej(this.logger.error(err.message));
              });

              mute.unmutedAt = Date.now();

              this.emit("unmuteMember", mute);
            }, delay);
          }
        }

        return res(true);
      });
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
   * @returns {Promise<any>}
   */
  checkUpdate(): Promise<any> {
    return new Promise(async (res, rej) => {
      const data = await fetch(
        "https://registry.npmjs.com/discord-moderation"
      ).then((res) => res.json());
      const lastVersion: string = (data as any)["dist-tags"]["latest"];

      if (version !== lastVersion) {
        return res(
          this.logger.warn(
            'New Version of Discord-Moderation avaliable!\nWe recomend you to update this module using "npm i discord-moderation@latest" command.'
          )
        );
      }
    });
  }

  /**
   * @returns {Promise<boolean>}
   */
  checkOptions(): Promise<boolean> {
    return new Promise(async (res, rej) => {
      var options = this.options;
      if (!options) this.options = defaultOptions;

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
