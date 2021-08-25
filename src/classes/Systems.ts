import { Base } from "./Base";
import { Client, GuildMember, Message, MessageEmbed } from "discord.js";
import { Options, links } from "../constants";
import { Logger } from "./Logger";
import { Utils } from "./Utils";

export declare interface Systems {
  client: Client;
  options: Options;

  utils: Utils;
  logger: Logger;
}

export class Systems extends Base {
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

  antiJoin(member: GuildMember): Promise<boolean> {
    return new Promise(async (res, rej) => {
      if (!member)
        return this.logger.error('Specify "GuildMember" in Systems#antiJoin');

      await member
        .kick("Anti-Join System.")
        .then((mem) => {
          const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle("Anti-Join System.")
            .setDescription(
              `**Hello! You were kicked from "${member.guild.name}"!**\n› **Reason**: **Anti-Join System.**`
            );

          member.send({
            embeds: [embed],
          });

          return res(true);
        })
        .catch((err) => {
          return this.logger.error(err);
        });
    });
  }

  antiLink(message: Message): Promise<boolean> {
    return new Promise(async (res, rej) => {
      if (!message.member) return;

      const immunityCheck = await this.utils.checkImmunity(message.member);
      if (immunityCheck) return;

      const linkCheck = links.some((link) => message.content.includes(link));
      if (linkCheck) {
        await message.delete().catch((err) => {
          return this.logger.error(err);
        });

        const embed = new MessageEmbed()
          .setColor("YELLOW")
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTitle("Anti-Link System.")
          .setDescription("**Links are restricted on this server!**");

        message.channel.send({
          content: `${message.author}`,
          embeds: [embed],
        });

        return res(true);
      } else return res(false);
    });
  }
}
