import { Client, GuildMember, Message, MessageEmbed } from "discord.js";
import { Options, links } from "../constants";

import { Base } from "./Base";
import { Logger } from "./Logger";
import { Utils } from "./Utils";

export declare interface Systems {
  client: Client;
  options: Options;

  utils: Utils;
  logger: Logger;
}

export declare class Systems extends Base {
  constructor(client: Client, options: Options);

  antiJoin(member: GuildMember): Promise<boolean>;
  antiLink(message: Message): Promise<boolean>;
}
