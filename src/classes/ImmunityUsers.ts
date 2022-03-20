import { Client, Guild, GuildMember } from "discord.js";
import { ImmunityUsersData, Options } from "../constants";
import { Logger } from "./Logger";
import { Utils } from "./Utils";

export interface ImmunityUsers {
  client: Client;
  options: Options;

  utils: Utils;
  logger: Logger;
}

/**
 * Class that handles Immunity Users.
 *
 * @class
 * @classdesc Immunity Users Class
 */
export class ImmunityUsers {
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
   * Method that adds Member to Immunity List.
   *
   * @param {GuildMember} member Discord Member
   * @returns {Promise<boolean>}
   */
  add(member: GuildMember): Promise<boolean> {
    return new Promise(async (res, rej) => {
      if (!member) {
        return rej(
          this.logger.error('Specify "GuildMember" in ImmunityUsers#add.')
        );
      }

      const data = await this.utils.getGuild(member.guild);
      const fastCheck = data.immunityUsers.find(
        (m) => m.memberID === member.id
      );

      if (fastCheck) return res(false);

      const userData: ImmunityUsersData = {
        memberID: member.id,
        status: true,
      };

      data.immunityUsers.push(userData);
      await this.utils.setData(member.guild, data);

      return res(true);
    });
  }

  /**
   * Method that removes Member to Immunity List.
   *
   * @param {GuildMember} member Discord Member
   * @returns {Promise<boolean>}
   */
  delete(member: GuildMember): Promise<boolean> {
    return new Promise(async (res, rej) => {
      if (!member) {
        return rej(
          this.logger.error('Specify "GuildMember" in ImmunityUsers#add.')
        );
      }

      const data = await this.utils.getGuild(member.guild);
      const fastCheck = data.immunityUsers.find(
        (m) => m.memberID === member.id
      );

      if (!fastCheck) return res(false);

      data.immunityUsers.filter((m) => m.memberID !== member.id);

      await this.utils.setData(member.guild, data);

      return res(true);
    });
  }

  /**
   * Method that returns an Array of Immunity Users.
   *
   * @param {Guild} guild Discord Guild
   * @returns {Promise<ImmunityUsersData[]>}
   */
  getAll(guild: Guild): Promise<ImmunityUsersData[]> {
    return new Promise(async (res, rej) => {
      const data = await this.utils.getGuild(guild);
      const immunityUsers = data.immunityUsers;

      if (!immunityUsers.length) return res([]);
      else return res(immunityUsers);
    });
  }
}
