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

export declare interface GuildSystems {
  client: Client;
  options: Options;

  utils: Utils;
  logger: Logger;
}

export declare class GuildSystems extends Base {
  constructor(client: Client, options: Options);

  antiJoin(member: GuildMember): Promise<boolean>;
  antiLink(message: Message): Promise<boolean>;
  ghostPing(message: Message): Promise<boolean>;
  antiInvite(invite: Invite): Promise<boolean>;
}
