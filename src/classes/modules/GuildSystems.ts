import {
  Client,
  GuildMember,
  Message,
  MessageEmbed,
  Invite,
  TextChannel,
} from "discord.js";
import { Options, links } from "../../constants";
import { Logger } from "../Logger";
import { Utils } from "../Utils";
import { Base } from "../Base";

export interface GuildSystems {
  client: Client;
  options: Options;

  utils: Utils;
  logger: Logger;
}

export class GuildSystems extends Base {
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

  /**
   * Method that controls Anti Join System
   *
   * @param {GuildMember} member Discord Member
   * @returns {Promise<boolean>}
   */
  antiJoin(member: GuildMember): Promise<boolean> {
    return new Promise(async (res, rej) => {
      if (!member)
        return rej(
          this.logger.warn('Specify "GuildMember" in Systems#antiJoin')
        );

      await member
        .kick("Anti-Join System.")
        .then((mem) => {
          const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle("Anti-Join System.")
            .setDescription(
              `**Hello! You were kicked from "${member.guild.name}"!**\n› **Reason**: **Anti-Join System.**`
            );

          mem.send({
            embeds: [embed],
          });

          return res(true);
        })
        .catch((err) => {
          return rej(this.logger.warn(err));
        });
    });
  }

  /**
   * Method that controls Anti Link System
   *
   * @param {Message} message Discord Message
   * @returns {Promise<boolean>}
   */
  antiLink(message: Message): Promise<boolean> {
    return new Promise(async (res, rej) => {
      if (!message.member) return;

      const immunityCheck = await this.utils.checkImmunity(message.member);
      if (immunityCheck) return;

      const linkCheck = links.some((link) => message.content.includes(link));
      if (linkCheck) {
        await message.delete().catch((err) => {
          return rej(this.logger.warn(err));
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

  /**
   * Method that controls Ghost Ping System
   *
   * @param {Message} message Discord Message
   * @returns {Promise<boolean>}
   */
  ghostPing(message: Message): Promise<boolean> {
    return new Promise(async (res, rej) => {
      if (!message)
        return rej(this.logger.warn('Specify "Message" in Systems#ghostPing!'));
      if (!message.mentions) return;
      if (!message.mentions.members) return;

      if (message.mentions.members.size) return res(true);
      else return res(false);
    });
  }

  /**
   * Method that controls Anti invite System
   *
   * @param {Invite} invite Discord Invite
   * @returns {Promise<boolean>}
   */
  antiInvite(invite: Invite): Promise<boolean> {
    return new Promise(async (res, rej) => {
      if (!invite)
        return rej(this.logger.warn('Specify "Invite" in Systems#antiInvite!'));
      if (!invite.inviter) return;

      const immunityCheck = await this.utils.checkImmunity(invite);
      if (immunityCheck) return;

      const embed = new MessageEmbed()
        .setColor("YELLOW")
        .setAuthor(
          invite.inviter.username,
          invite.inviter.displayAvatarURL({ dynamic: true })
        )
        .setTitle("Anti-Invite System.")
        .setDescription(
          "**Invites are restricted in this server! Invite has been deleted!**"
        );

      await invite.delete("Anti-Invite System.");
      await (invite.channel as TextChannel).send({
        embeds: [embed],
      });

      return res(true);
    });
  }
}
